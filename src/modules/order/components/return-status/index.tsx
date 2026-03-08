"use client"

import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface ReturnItem {
  id: string
  item_id: string
  quantity: number
  received_quantity?: number
  damaged_quantity?: number
  reason?: {
    id: string
    value: string
    label?: string
  }
  note?: string
}

interface Return {
  id: string
  status: string
  refund_amount?: number
  items?: ReturnItem[]
  created_at: string
}

type Props = {
  returns: Return[]
  currencyCode: string
}

const statusColorMap: Record<
  string,
  "green" | "orange" | "red" | "grey" | "blue" | "purple"
> = {
  requested: "orange",
  received: "green",
  canceled: "red",
  partially_received: "blue",
}

const ReturnStatus = ({ returns, currencyCode }: Props) => {
  const t = useTranslations("returns")

  if (!returns || returns.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Text className="txt-medium-plus">
        {t.has("statusTitle") ? t("statusTitle") : "Return Requests"}
      </Text>

      {returns.map((ret, idx) => (
        <div key={ret.id} className="rounded-lg border border-ui-border-base p-4">
          <div className="mb-3 flex items-center justify-between">
            <Text className="txt-compact-medium">
              {t.has("returnLabel") ? t("returnLabel") : "Return"} #{idx + 1}
            </Text>
            <Badge color={statusColorMap[ret.status] || "grey"}>
              {t.has(`status.${ret.status}`)
                ? t(`status.${ret.status}`)
                : ret.status}
            </Badge>
          </div>

          <Text className="mb-2 text-sm text-ui-fg-subtle">
            {t.has("submittedOn") ? t("submittedOn") : "Submitted on"}{" "}
            {new Date(ret.created_at).toLocaleDateString()}
          </Text>

          {ret.items && ret.items.length > 0 && (
            <div className="mt-2 space-y-1">
              {ret.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-ui-fg-subtle"
                >
                  <Text className="text-sm">
                    {t.has("itemQuantity") ? t("itemQuantity") : "Qty"}: {item.quantity}
                    {item.received_quantity != null && item.received_quantity > 0 && (
                      <span className="ml-2 text-ui-fg-muted">
                        ({t.has("received") ? t("received") : "Received"}: {" "}
                        {item.received_quantity})
                      </span>
                    )}
                  </Text>
                  {item.reason && (
                    <Text className="text-sm text-ui-fg-muted">
                      {item.reason.label || item.reason.value}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          )}

          {ret.refund_amount != null && ret.refund_amount > 0 && (
            <div className="mt-2 border-t border-ui-border-base pt-2">
              <Text className="text-sm">
                {t.has("refundAmount") ? t("refundAmount") : "Refund amount"}:{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: currencyCode,
                }).format(ret.refund_amount / 100)}
              </Text>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReturnStatus
