"use client"

import { Badge, Button, Textarea, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

interface Message {
  id: string
  author: string
  role: "customer" | "admin"
  content: string
  createdAt: string
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg_1",
    author: "John Doe",
    role: "customer",
    content:
      "I received the wrong item in my order. I ordered the Lind 3-Seat Sofa in gray but received it in beige.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "msg_2",
    author: "Admin",
    role: "admin",
    content:
      "We apologize for the inconvenience. Could you please share a photo of the item you received?",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "msg_3",
    author: "John Doe",
    role: "customer",
    content:
      "Here is the photo. The color is clearly beige, not the gray I ordered.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

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

export default function TicketDetail({ ticketId }: { ticketId: string }) {
  const t = useTranslations("admin")
  const [status, setStatus] = useState<TicketStatus>("open")
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [reply, setReply] = useState("")

  const sendReply = () => {
    if (!reply.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${prev.length + 1}`,
        author: "Admin",
        role: "admin",
        content: reply.trim(),
        createdAt: new Date().toISOString(),
      },
    ])
    setReply("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {t("ticketDetail")} #{ticketId.replace("ticket_", "")}
        </h1>
        <Badge color={statusColors[status]}>
          {t(`ticketStatus_${status}` as any)}
        </Badge>
      </div>

      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">{t("ticketSubject")}</h2>
        <Text>Wrong item received</Text>
        <div className="mt-2 flex gap-2">
          <Text className="text-sm text-ui-fg-subtle">
            John Doe · john@example.com
          </Text>
          <Badge>return</Badge>
        </div>
      </div>

      {statusTransitions[status].length > 0 && (
        <div className="flex gap-2">
          {statusTransitions[status].map((next) => (
            <Button
              key={next}
              variant="secondary"
              onClick={() => setStatus(next)}
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
                {new Date(msg.createdAt).toLocaleString()}
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
        <Button disabled={!reply.trim()} onClick={sendReply}>
          {t("sendReply")}
        </Button>
      </div>
    </div>
  )
}
