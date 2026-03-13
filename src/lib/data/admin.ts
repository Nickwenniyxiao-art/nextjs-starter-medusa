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

export async function getAdminDashboardStats() {
  const [ordersToday, revenueToday, lowStock, activeUsers, openTickets] = await Promise.all([
    adminFetch<{ count?: number }>("/admin/analytics/orders-today").catch(() => ({ count: 0 })),
    adminFetch<{ amount?: number }>("/admin/analytics/revenue-today").catch(() => ({ amount: 0 })),
    adminFetch<{ count?: number }>("/admin/inventory/low-stock-alerts").catch(() => ({ count: 0 })),
    adminFetch<{ count?: number }>("/admin/analytics/active-users").catch(() => ({ count: 0 })),
    adminFetch<{ count?: number }>("/admin/after-sales/tickets", {
      query: { status: "open", limit: 1 },
    }).catch(() => ({ count: 0 })),
  ])

  return {
    ordersToday: ordersToday.count || 0,
    revenueToday: revenueToday.amount || 0,
    lowStockCount: lowStock.count || 0,
    activeUsers: activeUsers.count || 0,
    openTickets: openTickets.count || 0,
  }
}

export async function getRevenueTrend(period: "daily" | "weekly" | "monthly" = "daily") {
  const data = await adminFetch<{ data?: { date: string; amount: number }[] }>(
    "/admin/finance/revenue-trend",
    { query: { period } }
  )

  return data.data || []
}
