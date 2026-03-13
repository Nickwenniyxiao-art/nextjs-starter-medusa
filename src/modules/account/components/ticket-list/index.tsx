"use client"

import { Badge, Input, Text } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

interface Ticket {
  id: string
  displayId: number
  subject: string
  customerEmail: string
  customerName: string
  status: TicketStatus
  type: "return" | "exchange" | "claim" | "inquiry" | "complaint"
  createdAt: string
  updatedAt: string
  orderId?: string
  orderDisplayId?: number
}

const MOCK_TICKETS: Ticket[] = Array.from({ length: 15 }, (_, i) => ({
  id: `ticket_${String(i + 1).padStart(3, "0")}`,
  displayId: i + 1,
  subject: [
    "Wrong item received",
    "Item damaged during shipping",
    "Request size exchange",
    "Order not delivered",
    "Refund inquiry",
    "Color mismatch",
    "Missing items in package",
    "Want to cancel order",
    "Product quality issue",
    "Delivery delay inquiry",
    "Request return label",
    "Billing discrepancy",
    "Request gift wrapping",
    "Address change request",
    "Product recommendation",
  ][i],
  customerEmail: `customer${i + 1}@example.com`,
  customerName: [
    "John Doe",
    "Emma Smith",
    "Liam Johnson",
    "Olivia Brown",
    "Noah Davis",
    "Ava Wilson",
    "James Taylor",
    "Sophia Anderson",
    "Benjamin Martin",
    "Mia Thompson",
    "Lucas Garcia",
    "Charlotte Robinson",
    "Henry Clark",
    "Amelia Lewis",
    "Alexander Hall",
  ][i],
  status: (["open", "in_progress", "resolved", "closed"] as TicketStatus[])[
    i % 4
  ],
  type: (["return", "exchange", "claim", "inquiry", "complaint"] as const)[
    i % 5
  ],
  createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  orderId: i < 10 ? `order_${String(i + 1).padStart(3, "0")}` : undefined,
  orderDisplayId: i < 10 ? i + 1 : undefined,
}))

const statusColors: Record<TicketStatus, "orange" | "blue" | "green" | "grey"> =
  {
    open: "orange",
    in_progress: "blue",
    resolved: "green",
    closed: "grey",
  }

export default function TicketList() {
  const t = useTranslations("admin")
  const router = useRouter()
  const { locale, countryCode } = useParams() as {
    locale: string
    countryCode: string
  }
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    let list = MOCK_TICKETS
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          String(t.displayId).includes(q)
      )
    }
    return list
  }, [statusFilter, search])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("tickets")}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

      <div className="flex gap-2 flex-wrap">
        {(["all", "open", "in_progress", "resolved", "closed"] as const).map(
          (s) => (
            <button
              key={s}
              className={`rounded-full border px-3 py-1 text-sm ${
                statusFilter === s ? "bg-forest text-white" : "bg-white"
              }`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? t("allTickets") : t(`ticketStatus_${s}` as any)}
            </button>
          )
        )}
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("searchTickets")}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">{t("ticketSubject")}</th>
              <th className="p-2 text-left">{t("customerName")}</th>
              <th className="p-2 text-left">{t("ticketType")}</th>
              <th className="p-2 text-left">{t("status")}</th>
              <th className="p-2 text-left">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ui-fg-subtle">
                  <Text>{t("noTicketsFound")}</Text>
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="cursor-pointer border-b hover:bg-gray-50"
                  onClick={() =>
                    router.push(
                      `/${locale}/${countryCode}/account/admin/tickets/${ticket.id}`
                    )
                  }
                >
                  <td className="p-2">#{ticket.displayId}</td>
                  <td className="p-2 font-medium">{ticket.subject}</td>
                  <td className="p-2">{ticket.customerName}</td>
                  <td className="p-2">
                    <Badge>{t(`ticketType_${ticket.type}` as any)}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge color={statusColors[ticket.status]}>
                      {t(`ticketStatus_${ticket.status}` as any)}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
