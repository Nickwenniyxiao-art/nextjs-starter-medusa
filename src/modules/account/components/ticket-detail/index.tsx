"use client"

import {
  TicketDetailData,
  TicketMessage,
  sendTicketMessage,
  updateTicketStatus,
} from "@lib/data/admin"
import { Badge, Button, Textarea, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

const statusTransitions: Record<TicketStatus, TicketStatus[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["resolved", "closed"],
  resolved: ["closed"],
  closed: [],
}

const statusColors: Record<TicketStatus, "orange" | "blue" | "green" | "grey"> =
  {
    open: "orange",
    in_progress: "blue",
    resolved: "green",
    closed: "grey",
  }

export default function TicketDetail({
  ticket,
  initialMessages,
}: {
  ticket: TicketDetailData
  initialMessages: TicketMessage[]
}) {
  const t = useTranslations("admin")
  const [status, setStatus] = useState<TicketStatus>(ticket.status)
  const [messages, setMessages] = useState<TicketMessage[]>(initialMessages)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)

  const handleStatusChange = async (next: TicketStatus) => {
    const ok = await updateTicketStatus(ticket.id, next)
    if (ok) setStatus(next)
  }

  const sendReply = async () => {
    if (!reply.trim() || sending) return
    setSending(true)
    const ok = await sendTicketMessage(ticket.id, reply.trim())
    if (ok) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          author: "Admin",
          role: "admin",
          content: reply.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      setReply("")
    }
    setSending(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {t("ticketDetail")} #{ticket.display_id}
        </h1>
        <Badge color={statusColors[status]}>
          {t(`ticketStatus_${status}` as any)}
        </Badge>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">{t("ticketSubject")}</h2>
        <Text>{ticket.subject}</Text>
        <div className="mt-2 flex gap-2">
          <Text className="text-sm text-ui-fg-subtle">
            {ticket.customer_name} · {ticket.customer_email}
          </Text>
          <Badge>{t(`ticketType_${ticket.type}` as any)}</Badge>
        </div>
      </div>

      {statusTransitions[status].length > 0 && (
        <div className="flex gap-2">
          {statusTransitions[status].map((next) => (
            <Button
              key={next}
              variant="secondary"
              onClick={() => handleStatusChange(next)}
            >
              {t(`ticketAction_${next}` as any)}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("ticketMessages")}</h2>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded border p-3 ${
              msg.role === "admin"
                ? "ml-8 border-forest/30 bg-forest/5"
                : "mr-8"
            }`}
          >
            <div className="mb-1 flex items-center gap-2">
              <Text className="font-medium text-sm">{msg.author}</Text>
              <Badge
                color={msg.role === "admin" ? "green" : "grey"}
                className="text-xs"
              >
                {msg.role === "admin" ? t("adminRole") : t("customerRole")}
              </Badge>
              <Text className="text-xs text-ui-fg-subtle">
                {new Date(msg.created_at).toLocaleString()}
              </Text>
            </div>
            <Text>{msg.content}</Text>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={t("ticketReplyPlaceholder")}
          rows={3}
        />
        <Button disabled={!reply.trim() || sending} onClick={sendReply}>
          {sending ? t("sending") || "Sending..." : t("sendReply")}
        </Button>
      </div>
    </div>
  )
}
