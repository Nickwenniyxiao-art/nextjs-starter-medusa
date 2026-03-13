"use client"

import { Badge, Input, Text } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

interface Ticket {
  id: string
  display_id?: number
  subject?: string
  customer_email?: string
  customer_name?: string
  status: TicketStatus
  type?: "return" | "exchange" | "claim" | "inquiry" | "complaint"
  created_at: string
}

interface SlaConfig {
  response_time_hours: number
  resolution_time_hours: number
  auto_escalation_enabled?: boolean
}

const statusColors: Record<TicketStatus, "orange" | "blue" | "green" | "grey"> = {
  open: "orange",
  in_progress: "blue",
  resolved: "green",
  closed: "grey",
}

function getSlaState(createdAt: string, slaHours: number) {
  const deadline = new Date(createdAt).getTime() + slaHours * 3600 * 1000
  const now = Date.now()
  const remainRatio = (deadline - now) / (slaHours * 3600 * 1000)

  if (now > deadline) {
    return { label: "🔴 已超时", className: "text-rose-700" }
  }

  if (remainRatio < 0.2) {
    return { label: "🟡 即将超时", className: "text-amber-700" }
  }

  return { label: "🟢 正常", className: "text-emerald-700" }
}

export default function TicketList({ tickets, slaConfig }: { tickets: Ticket[]; slaConfig: SlaConfig }) {
  const t = useTranslations("admin")
  const router = useRouter()
  const { locale, countryCode } = useParams() as {
    locale: string
    countryCode: string
  }
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    let list = tickets
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (ticket) =>
          String(ticket.subject || "").toLowerCase().includes(q) ||
          String(ticket.customer_email || "").toLowerCase().includes(q) ||
          String(ticket.customer_name || "").toLowerCase().includes(q) ||
          String(ticket.display_id || "").includes(q)
      )
    }
    return list
  }, [statusFilter, search, tickets])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("tickets")}</h1>

      <div className="flex gap-2 flex-wrap">
        {(["all", "open", "in_progress", "resolved", "closed"] as const).map((s) => (
          <button
            key={s}
            className={`rounded-full border px-3 py-1 text-sm ${statusFilter === s ? "bg-forest text-white" : "bg-white"}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? t("allTickets") : t(`ticketStatus_${s}` as any)}
          </button>
        ))}
      </div>

      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchTickets")} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">{t("ticketSubject")}</th>
              <th className="p-2 text-left">{t("customerName")}</th>
              <th className="p-2 text-left">{t("ticketType")}</th>
              <th className="p-2 text-left">{t("status")}</th>
              <th className="p-2 text-left">SLA</th>
              <th className="p-2 text-left">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-ui-fg-subtle">
                  <Text>{t("noTicketsFound")}</Text>
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => {
                const slaState = getSlaState(
                  ticket.created_at,
                  ticket.status === "resolved" || ticket.status === "closed"
                    ? slaConfig.resolution_time_hours
                    : slaConfig.response_time_hours
                )

                return (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer border-b hover:bg-gray-50"
                    onClick={() => router.push(`/${locale}/${countryCode}/account/admin/tickets/${ticket.id}`)}
                  >
                    <td className="p-2">#{ticket.display_id || ticket.id}</td>
                    <td className="p-2 font-medium">{ticket.subject || "-"}</td>
                    <td className="p-2">{ticket.customer_name || ticket.customer_email || "-"}</td>
                    <td className="p-2">
                      <Badge>{ticket.type ? t(`ticketType_${ticket.type}` as any) : "-"}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge color={statusColors[ticket.status]}>{t(`ticketStatus_${ticket.status}` as any)}</Badge>
                    </td>
                    <td className={`p-2 text-xs font-medium ${slaState.className}`}>{slaState.label}</td>
                    <td className="p-2">{new Date(ticket.created_at).toLocaleDateString()}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
