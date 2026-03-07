"use client"

import { Badge } from "@medusajs/ui"
import { useLocale, useTranslations } from "next-intl"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const resolveStatusKey = (order: HttpTypes.StoreOrder) => {
  if (
    order.fulfillment_status === "fulfilled" ||
    order.fulfillment_status === "shipped"
  ) {
    return order.fulfillment_status
  }

  if (order.status === "completed" || order.status === "canceled") {
    return order.status
  }

  return "pending"
}

const OrderCard = ({ order }: OrderCardProps) => {
  const t = useTranslations("order")
  const locale = useLocale()
  const statusKey = resolveStatusKey(order)

  return (
    <LocalizedClientLink
      href={`/account/orders/details/${order.id}`}
      className="block rounded-rounded border border-ui-border-base p-4 transition-colors hover:border-ui-border-interactive"
      data-testid="order-card"
    >
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-4 sm:items-center sm:gap-4">
        <div>
          <p className="text-ui-fg-subtle">{t("orderNumber")}</p>
          <p className="font-semibold" data-testid="order-display-id">
            #{order.display_id}
          </p>
        </div>

        <div>
          <p className="text-ui-fg-subtle">{t("orderDate")}</p>
          <p data-testid="order-created-at">
            {new Date(order.created_at).toLocaleDateString(locale)}
          </p>
        </div>

        <div>
          <p className="text-ui-fg-subtle">{t("orderStatus")}</p>
          <Badge color="blue" size="2xsmall" data-testid="order-status">
            {t(`status.${statusKey}`)}
          </Badge>
        </div>

        <div>
          <p className="text-ui-fg-subtle">{t("orderTotal")}</p>
          <p className="font-semibold" data-testid="order-amount">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default OrderCard
