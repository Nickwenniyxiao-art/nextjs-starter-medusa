"use client"

import { Badge, Button, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface ReturnRequest {
  id: string
  orderId: string
  status: "requested" | "received" | "approved" | "rejected" | "refunded"
  items: { title: string; quantity: number }[]
  reason: string
  createdAt: string
  refundAmount?: number
}

const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: "ret_001",
    orderId: "order_001",
    status: "requested",
    items: [{ title: "Lind 3-Seat Sofa", quantity: 1 }],
    reason: "Color difference",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "ret_002",
    orderId: "order_001",
    status: "approved",
    items: [{ title: "Berg Coffee Table", quantity: 1 }],
    reason: "Shipping damage",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    refundAmount: 39900,
  },
]

const statusColors: Record<
  string,
  "orange" | "blue" | "green" | "red" | "grey"
> = {
  requested: "orange",
  received: "blue",
  approved: "green",
  rejected: "red",
  refunded: "grey",
}

const statusFlow: Record<string, string[]> = {
  requested: ["received", "rejected"],
  received: ["approved", "rejected"],
  approved: ["refunded"],
  rejected: [],
  refunded: [],
}

export default function OrderReturns({ orderId }: { orderId: string }) {
  const t = useTranslations("admin")
  const [returns, setReturns] = useState(
    MOCK_RETURNS.filter((r) => r.orderId === orderId)
  )

  const updateStatus = (returnId: string, newStatus: string) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === returnId
          ? { ...r, status: newStatus as ReturnRequest["status"] }
          : r
      )
    )
  }

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("returnManagement")}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

      {returns.length === 0 ? (
        <div className="rounded border p-8 text-center">
          <Text className="text-ui-fg-subtle">{t("noReturns")}</Text>
        </div>
      ) : (
        returns.map((ret) => (
          <div key={ret.id} className="rounded border bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Text className="font-semibold">
                {t("returnRequest")} {ret.id}
              </Text>
              <Badge color={statusColors[ret.status]}>
                {t(`returnStatus_${ret.status}` as any)}
              </Badge>
            </div>

            <div className="space-y-1">
              {ret.items.map((item, idx) => (
                <Text key={idx}>
                  • {item.title} × {item.quantity}
                </Text>
              ))}
            </div>

            <Text className="text-sm text-ui-fg-subtle">
              {t("reason")}: {ret.reason}
            </Text>
            <Text className="text-sm text-ui-fg-subtle">
              {new Date(ret.createdAt).toLocaleString()}
            </Text>
            {ret.refundAmount && (
              <Text className="text-sm font-medium">
                {t("refundAmount")}:{" "}
                {currencyFormatter.format(ret.refundAmount / 100)}
              </Text>
            )}

            {statusFlow[ret.status]?.length > 0 && (
              <div className="flex gap-2 pt-2">
                {statusFlow[ret.status].map((next) => (
                  <Button
                    key={next}
                    variant={next === "rejected" ? "danger" : "secondary"}
                    size="small"
                    onClick={() => updateStatus(ret.id, next)}
                  >
                    {t(`returnAction_${next}` as any)}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
