"use client"

import { convertToLocale } from "@lib/util/money"
import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface ExchangeItem {
  id: string
  item_id: string
  quantity: number
  note?: string
}

interface AdditionalItem {
  id: string
  item_id: string
  quantity: number
  unit_price: number
  title?: string
  variant_title?: string
  thumbnail?: string
}

interface Exchange {
  id: string
  display_id: number
  order_version: number
  canceled_at: string | null
  created_at: string
  additional_items?: AdditionalItem[]
}

type Props = {
  exchanges: Exchange[]
  currencyCode: string
}

const statusColorMap: Record<string, "green" | "orange" | "red" | "grey" | "blue"> = {
  active: "orange",
  completed: "green",
  canceled: "red",
}

function getExchangeStatus(exchange: Exchange): string {
  if (exchange.canceled_at) return "canceled"

  return "active"
}

const ExchangeStatus = ({ exchanges, currencyCode }: Props) => {
  const t = useTranslations("exchanges")

  if (!exchanges || exchanges.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Text className="txt-medium-plus">
        {t.has("statusTitle") ? t("statusTitle") : "Exchanges"}
      </Text>

      {exchanges.map((exchange) => {
        const status = getExchangeStatus(exchange)

        return (
          <div key={exchange.id} className="rounded-lg border border-ui-border-base p-4">
            <div className="mb-3 flex items-center justify-between">
              <Text className="txt-compact-medium">
                {t.has("exchangeLabel") ? t("exchangeLabel") : "Exchange"} #
                {exchange.display_id}
              </Text>
              <Badge color={statusColorMap[status] || "grey"}>
                {t.has(`status.${status}`) ? t(`status.${status}`) : status}
              </Badge>
            </div>

            <Text className="mb-2 text-sm text-ui-fg-subtle">
              {t.has("submittedOn") ? t("submittedOn") : "Submitted on"}{" "}
              {new Date(exchange.created_at).toLocaleDateString()}
            </Text>

            {exchange.additional_items && exchange.additional_items.length > 0 && (
              <div className="mt-2 space-y-1">
                <Text className="text-xs font-medium text-ui-fg-muted">
                  {t.has("newItems") ? t("newItems") : "New items"}
                </Text>
                {exchange.additional_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-ui-fg-subtle">
                    <Text className="text-sm">
                      {item.title || item.variant_title || "Item"} × {item.quantity}
                    </Text>
                    <Text className="text-sm">
                      {convertToLocale({
                        amount: item.unit_price,
                        currency_code: currencyCode,
                      })}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ExchangeStatus
