"use client"

import { convertToLocale } from "@lib/util/money"
import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface ExchangeItem {
  id: string
  item_id: string
  quantity: number
  note?: string
  item?: {
    title?: string
    variant_title?: string
  }
}

interface AdditionalItem {
  id: string
  item_id: string
  quantity: number
  unit_price: number
  title?: string
  variant_title?: string
}

interface Exchange {
  id: string
  display_id: number
  canceled_at: string | null
  created_at: string
  items?: ExchangeItem[]
  additional_items?: AdditionalItem[]
}

type Props = {
  exchanges: Exchange[]
  currencyCode: string
}

const ExchangeStatus = ({ exchanges, currencyCode }: Props) => {
  const t = useTranslations("exchanges")

  if (!exchanges || exchanges.length === 0) {
    return null
  }

  const openSupport = () => {
    if (typeof window !== "undefined" && (window as any).$crisp) {
      ;(window as any).$crisp.push(["do", "chat:open"])
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Text className="txt-medium-plus">
        {t.has("statusTitle") ? t("statusTitle") : "Exchanges"}
      </Text>

      {exchanges.map((exchange) => {
        const status = exchange.canceled_at ? "canceled" : "active"

        return (
          <div
            key={exchange.id}
            className="rounded-lg border border-ui-border-base p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <Text className="txt-compact-medium">
                {t.has("exchangeLabel") ? t("exchangeLabel") : "Exchange"} #
                {exchange.display_id}
              </Text>
              <Badge color={status === "canceled" ? "red" : "orange"}>
                {t.has(`status.${status}`) ? t(`status.${status}`) : status}
              </Badge>
            </div>

            {!exchange.canceled_at && (
              <Text className="mb-2 text-sm text-ui-fg-subtle">
                {t("exchangeProgress")}: Active → Completed
              </Text>
            )}

            {exchange.items && exchange.items.length > 0 && (
              <div className="mt-2 space-y-1">
                <Text className="text-xs font-medium text-ui-fg-muted">
                  {t("originalItems")}
                </Text>
                {exchange.items.map((item) => (
                  <Text key={item.id} className="text-sm text-ui-fg-subtle">
                    {item.item?.title || item.item?.variant_title || "Item"} ×{" "}
                    {item.quantity}
                  </Text>
                ))}
              </div>
            )}

            {exchange.additional_items &&
              exchange.additional_items.length > 0 && (
                <div className="mt-2 space-y-1">
                  <Text className="text-xs font-medium text-ui-fg-muted">
                    {t.has("newItems") ? t("newItems") : "New items"}
                  </Text>
                  {exchange.additional_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-ui-fg-subtle"
                    >
                      <Text className="text-sm">
                        {item.title || item.variant_title || "Item"} ×{" "}
                        {item.quantity}
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

            {!exchange.canceled_at && (
              <button
                type="button"
                onClick={openSupport}
                className="mt-3 text-sm text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                {t("contactSupport")}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ExchangeStatus
