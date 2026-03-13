"use client"

import { TicketRecord } from "@lib/data/admin"
import { Badge, Input, Text } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

const statusColors: Record<TicketStatus, "orange" | "blue" | "green" | "grey"> =
  {
    open: "orange",
    in_progress: "blue",
    resolved: "green",
    closed: "grey",
  }

export default function TicketList({ tickets }: { tickets: TicketRecord[] }) {
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
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.customer_email.toLowerCase().includes(q) ||
          t.customer_name.toLowerCase().includes(q) ||
          String(t.display_id).includes(q)
      )
    }
    return list
  }, [tickets, statusFilter, search])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("tickets")}</h1>

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
                  <td className="p-2">#{ticket.display_id}</td>
                  <td className="p-2 font-medium">{ticket.subject}</td>
                  <td className="p-2">{ticket.customer_name}</td>
                  <td className="p-2">
                    <Badge>{t(`ticketType_${ticket.type}` as any)}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge color={statusColors[ticket.status]}>
                      {t(`ticketStatus_${ticket.status}` as any)}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {new Date(ticket.created_at).toLocaleDateString()}
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
