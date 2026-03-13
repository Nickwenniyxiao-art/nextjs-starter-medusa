"use server"

import { revalidatePath } from "next/cache"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD

let adminToken: string | null = null
let tokenExpiry = 0

async function getAdminToken(): Promise<string> {
  if (adminToken && Date.now() < tokenExpiry) {
    return adminToken
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Admin credentials are not configured")
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Admin authentication failed")
  }

  const data = await res.json()
  adminToken = data.token
  tokenExpiry = Date.now() + 55 * 60 * 1000
  return adminToken as string
}

export async function adminFetch<T = any>(
  path: string,
  options: {
    method?: string
    body?: any
    query?: Record<string, string | number | undefined>
  } = {}
): Promise<T> {
  const token = await getAdminToken()
  const url = new URL(`${MEDUSA_BACKEND_URL}${path}`)

  if (options.query) {
    Object.entries(options.query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}`.length > 0) {
        url.searchParams.set(k, `${v}`)
      }
    })
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Admin API ${res.status}: ${text}`)
  }

  return res.json()
}

export async function createFulfillment(
  orderId: string,
  items: { id: string; quantity: number }[],
  trackingNumber?: string
) {
  const { stock_locations } = await adminFetch<{ stock_locations: any[] }>(
    "/admin/stock-locations",
    { query: { limit: "1" } }
  )
  const locationId = stock_locations?.[0]?.id

  const result = await adminFetch(`/admin/orders/${orderId}/fulfillments`, {
    method: "POST",
    body: {
      location_id: locationId,
      items,
      ...(trackingNumber
        ? { metadata: { tracking_number: trackingNumber } }
        : {}),
    },
  })

  revalidatePath("/")
  return result
}

export async function createRefund(
  orderId: string,
  amount: number,
  reason?: string
) {
  const result = await adminFetch(`/admin/orders/${orderId}/refunds`, {
    method: "POST",
    body: { amount, reason },
  })
  revalidatePath("/")
  return result
}

export async function addOrderNote(
  orderId: string,
  existingNotes: { text: string; author: string; created_at: string }[],
  text: string,
  author: string
) {
  const newNote = { text, author, created_at: new Date().toISOString() }
  const result = await adminFetch(`/admin/orders/${orderId}`, {
    method: "POST",
    body: {
      metadata: {
        admin_notes: [...(existingNotes || []), newNote],
      },
    },
  })
  revalidatePath("/")
  return result
}

export async function batchFulfill(orderIds: string[]) {
  const { stock_locations } = await adminFetch<{ stock_locations: any[] }>(
    "/admin/stock-locations",
    { query: { limit: "1" } }
  )
  const locationId = stock_locations?.[0]?.id
  const results: { orderId: string; success: boolean; error?: string }[] = []

  for (const orderId of orderIds) {
    try {
      const orderRes = await adminFetch<{ order: any }>(`/admin/orders/${orderId}`, {
        query: { fields: "*items,+items.detail" },
      })

      const items = (orderRes.order?.items || [])
        .filter((i: any) => (i.detail?.fulfilled_quantity || 0) < i.quantity)
        .map((i: any) => ({
          id: i.id,
          quantity: i.quantity - (i.detail?.fulfilled_quantity || 0),
        }))

      if (items.length > 0) {
        await adminFetch(`/admin/orders/${orderId}/fulfillments`, {
          method: "POST",
          body: { location_id: locationId, items },
        })
      }

      results.push({ orderId, success: true })
    } catch (e: any) {
      results.push({ orderId, success: false, error: e.message })
    }
  }

  revalidatePath("/")
  return results
}

export async function adjustInventory(
  inventoryItemId: string,
  locationId: string,
  adjustment: number,
  reason: string
) {
  const { inventory_item } = await adminFetch<{ inventory_item: any }>(
    `/admin/inventory-items/${inventoryItemId}`,
    { query: { fields: "*location_levels" } }
  )

  const level = inventory_item.location_levels?.find(
    (l: any) => l.location_id === locationId
  )

  const newStocked = (level?.stocked_quantity || 0) + adjustment
  if (newStocked < 0) {
    throw new Error("Cannot reduce below 0")
  }

  const result = await adminFetch(
    `/admin/inventory-items/${inventoryItemId}/location-levels/${level.id}`,
    {
      method: "POST",
      body: {
        stocked_quantity: newStocked,
        metadata: {
          last_adjustment: {
            amount: adjustment,
            reason,
            date: new Date().toISOString(),
          },
        },
      },
    }
  )

  revalidatePath("/")
  return result
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderStats {
  totalOrders: number
  todayOrders: number
  todayRevenue: number
  pendingFulfillment: number
}

export interface TicketRecord {
  id: string
  display_id: number
  subject: string
  customer_email: string
  customer_name: string
  status: "open" | "in_progress" | "resolved" | "closed"
  type: "return" | "exchange" | "claim" | "inquiry" | "complaint"
  created_at: string
  updated_at: string
  order_id?: string
  order_display_id?: number
}

export interface TicketStatsData {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
}

export interface TicketMessage {
  id: string
  author: string
  role: "customer" | "admin"
  content: string
  created_at: string
}

export interface TicketDetailData {
  id: string
  display_id: number
  subject: string
  customer_email: string
  customer_name: string
  status: "open" | "in_progress" | "resolved" | "closed"
  type: "return" | "exchange" | "claim" | "inquiry" | "complaint"
  messages: TicketMessage[]
  created_at: string
}

export interface ReconciliationRecord {
  order_id: string
  display_id: number
  order_amount: number
  captured_amount: number
  diff: number
}

export interface TaxRegionRecord {
  id: string
  region: string
  country: string
  rate: number
  tax_inclusive: boolean
}

export interface CurrencyRecord {
  code: string
  revenue: number
  refunds: number
  net: number
  orders: number
}

export interface AuditLogEntry {
  id: string
  action: string
  actor: string
  resource: string
  created_at: string
}

export interface SecurityRole {
  id: string
  name: string
  permissions: string[]
}

export interface InventoryLogEntry {
  id: string
  type: "inbound" | "outbound" | "adjustment" | "return"
  quantity: number
  reason: string
  created_at: string
  user: string
}

// ---------------------------------------------------------------------------
// Order Stats
// ---------------------------------------------------------------------------

export async function fetchOrderStats(): Promise<OrderStats> {
  try {
    const data = await adminFetch<{ stats: OrderStats }>("/admin/orders/stats")
    return data.stats
  } catch {
    // Fallback: compute from orders list
    try {
      const today = new Date().toISOString().split("T")[0]
      const { orders, count } = await adminFetch<{ orders: any[]; count: number }>("/admin/orders", {
        query: { limit: 100, offset: 0, fields: "id,total,status,fulfillment_status,created_at", order: "-created_at" },
      })
      const todayOrders = orders.filter((o: any) => o.created_at?.startsWith(today))
      const todayRevenue = todayOrders.reduce((s: number, o: any) => s + (o.total || 0), 0)
      const pending = orders.filter((o: any) => o.fulfillment_status === "not_fulfilled" || o.fulfillment_status === "partially_fulfilled").length
      return { totalOrders: count, todayOrders: todayOrders.length, todayRevenue, pendingFulfillment: pending }
    } catch {
      return { totalOrders: 0, todayOrders: 0, todayRevenue: 0, pendingFulfillment: 0 }
    }
  }
}

export async function fetchOrders(params: {
  limit?: number
  offset?: number
  status?: string
  q?: string
} = {}): Promise<{ orders: any[]; count: number }> {
  try {
    return await adminFetch<{ orders: any[]; count: number }>("/admin/orders", {
      query: {
        limit: params.limit || 20,
        offset: params.offset || 0,
        status: params.status,
        q: params.q,
        fields: "id,display_id,status,total,currency_code,fulfillment_status,payment_status,created_at,email,*shipping_address",
        order: "-created_at",
      },
    })
  } catch {
    return { orders: [], count: 0 }
  }
}

export async function exportOrders(): Promise<Blob | null> {
  try {
    const token = await getAdminToken()
    const res = await fetch(`${MEDUSA_BACKEND_URL}/admin/orders/export`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.blob()
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Tickets
// ---------------------------------------------------------------------------

export async function fetchTickets(params: {
  status?: string
  q?: string
  limit?: number
  offset?: number
} = {}): Promise<{ tickets: TicketRecord[]; count: number }> {
  try {
    return await adminFetch<{ tickets: TicketRecord[]; count: number }>("/admin/tickets", {
      query: {
        limit: params.limit || 50,
        offset: params.offset || 0,
        status: params.status,
        q: params.q,
      },
    })
  } catch {
    return { tickets: [], count: 0 }
  }
}

export async function fetchTicketStats(): Promise<TicketStatsData> {
  try {
    const data = await adminFetch<{ stats: TicketStatsData }>("/admin/tickets/stats")
    return data.stats
  } catch {
    return { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 }
  }
}

export async function fetchTicketDetail(id: string): Promise<TicketDetailData | null> {
  try {
    const data = await adminFetch<{ ticket: TicketDetailData }>(`/admin/tickets/${id}`)
    return data.ticket
  } catch {
    return null
  }
}

export async function fetchTicketMessages(id: string): Promise<TicketMessage[]> {
  try {
    const data = await adminFetch<{ messages: TicketMessage[] }>(`/admin/tickets/${id}/messages`)
    return data.messages
  } catch {
    return []
  }
}

export async function sendTicketMessage(ticketId: string, content: string): Promise<boolean> {
  try {
    await adminFetch(`/admin/tickets/${ticketId}/messages`, {
      method: "POST",
      body: { content, role: "admin" },
    })
    revalidatePath("/")
    return true
  } catch {
    return false
  }
}

export async function updateTicketStatus(ticketId: string, status: string): Promise<boolean> {
  try {
    await adminFetch(`/admin/tickets/${ticketId}`, {
      method: "POST",
      body: { status },
    })
    revalidatePath("/")
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Finance
// ---------------------------------------------------------------------------

export async function fetchFinanceSummary(): Promise<{
  totalRevenue: number
  totalRefunds: number
  netRevenue: number
  stripeFees: number
}> {
  try {
    const data = await adminFetch<{ summary: { totalRevenue: number; totalRefunds: number; netRevenue: number; stripeFees: number } }>("/admin/finance/summary")
    return data.summary
  } catch {
    // Fallback: compute from orders
    try {
      const { orders } = await adminFetch<{ orders: any[] }>("/admin/orders", {
        query: { limit: 500, offset: 0, fields: "id,total,refunded_total,currency_code,payment_status" },
      })
      const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0)
      const totalRefunds = orders.reduce((s: number, o: any) => s + (o.refunded_total || 0), 0)
      return { totalRevenue, totalRefunds, netRevenue: totalRevenue - totalRefunds, stripeFees: Math.round(totalRevenue * 0.029 + orders.length * 30) }
    } catch {
      return { totalRevenue: 0, totalRefunds: 0, netRevenue: 0, stripeFees: 0 }
    }
  }
}

export async function fetchProfit(): Promise<{ monthly: { month: string; revenue: number; refunds: number; net: number }[] }> {
  try {
    return await adminFetch<{ monthly: { month: string; revenue: number; refunds: number; net: number }[] }>("/admin/finance/profit")
  } catch {
    return { monthly: [] }
  }
}

export async function fetchReconciliation(): Promise<ReconciliationRecord[]> {
  try {
    const data = await adminFetch<{ records: ReconciliationRecord[] }>("/admin/finance/reconciliation")
    return data.records
  } catch {
    // Fallback: build from orders with payment data
    try {
      const { orders } = await adminFetch<{ orders: any[] }>("/admin/orders", {
        query: { limit: 50, offset: 0, fields: "id,display_id,total,*payment_collections", order: "-created_at" },
      })
      return orders.map((o: any) => {
        const captured = (o.payment_collections || []).reduce(
          (s: number, pc: any) => s + (pc.captured_amount || pc.amount || 0), 0
        )
        return {
          order_id: o.id,
          display_id: o.display_id,
          order_amount: o.total || 0,
          captured_amount: captured,
          diff: captured - (o.total || 0),
        }
      })
    } catch {
      return []
    }
  }
}

export async function fetchTaxRates(): Promise<TaxRegionRecord[]> {
  try {
    const data = await adminFetch<{ tax_rates: TaxRegionRecord[] }>("/admin/finance/tax-rates")
    return data.tax_rates
  } catch {
    // Fallback: use Medusa tax regions
    try {
      const data = await adminFetch<{ tax_regions: any[] }>("/admin/tax-regions", {
        query: { limit: 50 },
      })
      return (data.tax_regions || []).map((r: any) => ({
        id: r.id,
        region: r.country_code?.toUpperCase() || r.province_code || "—",
        country: r.country_code?.toUpperCase() || "—",
        rate: r.default_tax_rate?.rate || 0,
        tax_inclusive: r.default_tax_rate?.is_combinable ?? false,
      }))
    } catch {
      return []
    }
  }
}

export async function fetchCurrencyBreakdown(): Promise<CurrencyRecord[]> {
  try {
    const data = await adminFetch<{ currencies: CurrencyRecord[] }>("/admin/finance/export")
    return data.currencies
  } catch {
    // Fallback: aggregate from orders
    try {
      const { orders } = await adminFetch<{ orders: any[] }>("/admin/orders", {
        query: { limit: 500, offset: 0, fields: "id,total,refunded_total,currency_code" },
      })
      const map = new Map<string, CurrencyRecord>()
      for (const o of orders) {
        const code = (o.currency_code || "usd").toUpperCase()
        const existing = map.get(code) || { code, revenue: 0, refunds: 0, net: 0, orders: 0 }
        existing.revenue += o.total || 0
        existing.refunds += o.refunded_total || 0
        existing.net += (o.total || 0) - (o.refunded_total || 0)
        existing.orders += 1
        map.set(code, existing)
      }
      return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
    } catch {
      return []
    }
  }
}

export async function fetchTaxReport(): Promise<Blob | null> {
  try {
    const token = await getAdminToken()
    const res = await fetch(`${MEDUSA_BACKEND_URL}/admin/finance/tax-report`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.blob()
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export async function fetchInventoryReport(params: {
  limit?: number
  offset?: number
  q?: string
} = {}): Promise<{ inventory_items: any[]; count: number }> {
  try {
    return await adminFetch<{ inventory_items: any[]; count: number }>("/admin/inventory-items", {
      query: {
        limit: params.limit || 50,
        offset: params.offset || 0,
        q: params.q,
        fields: "id,sku,title,*location_levels",
        order: "sku",
      },
    })
  } catch {
    return { inventory_items: [], count: 0 }
  }
}

export async function fetchInventoryLogs(itemId: string): Promise<InventoryLogEntry[]> {
  try {
    const data = await adminFetch<{ logs: InventoryLogEntry[] }>(`/admin/inventory/${itemId}/logs`)
    return data.logs
  } catch {
    // Fallback: read from item metadata
    try {
      const { inventory_item } = await adminFetch<{ inventory_item: any }>(`/admin/inventory-items/${itemId}`, {
        query: { fields: "id,sku,title,metadata,*location_levels" },
      })
      const lastAdj = inventory_item.metadata?.last_adjustment
      if (lastAdj) {
        return [{
          id: "log_latest",
          type: "adjustment",
          quantity: lastAdj.amount || 0,
          reason: lastAdj.reason || "Manual adjustment",
          created_at: lastAdj.date || new Date().toISOString(),
          user: "admin",
        }]
      }
      return []
    } catch {
      return []
    }
  }
}

export async function fetchInventoryTurnover(): Promise<{
  items: { sku: string; title: string; turnoverRate: number; avgDaysToSell: number }[]
}> {
  try {
    return await adminFetch<{ items: { sku: string; title: string; turnoverRate: number; avgDaysToSell: number }[] }>("/admin/inventory/turnover")
  } catch {
    return { items: [] }
  }
}

// ---------------------------------------------------------------------------
// Security / Audit
// ---------------------------------------------------------------------------

export async function fetchAuditLogs(params: {
  limit?: number
  offset?: number
} = {}): Promise<{ logs: AuditLogEntry[]; count: number }> {
  try {
    return await adminFetch<{ logs: AuditLogEntry[]; count: number }>("/admin/security/audit-logs", {
      query: { limit: params.limit || 50, offset: params.offset || 0 },
    })
  } catch {
    return { logs: [], count: 0 }
  }
}

export async function fetchSecurityRoles(): Promise<SecurityRole[]> {
  try {
    const data = await adminFetch<{ roles: SecurityRole[] }>("/admin/security/roles")
    return data.roles
  } catch {
    return []
  }
}
