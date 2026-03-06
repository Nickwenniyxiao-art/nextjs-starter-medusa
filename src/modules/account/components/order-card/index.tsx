"use client"

import { Badge } from "@medusajs/ui"
import { useTranslations } from "next-intl"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const STATUS_KEY_BY_ORDER_STATUS: Record<string, string> = {
  pending: "pending",
  completed: "completed",
  archived: "archived",
  canceled: "canceled",
  requires_action: "requiresAction",
}

const STATUS_KEY_BY_FULFILLMENT: Record<string, string> = {
  not_fulfilled: "notFulfilled",
  partially_fulfilled: "partiallyFulfilled",
  fulfilled: "fulfilled",
  partially_shipped: "partiallyShipped",
  shipped: "shipped",
  partially_delivered: "partiallyDelivered",
  delivered: "delivered",
  canceled: "canceled",
}

const STATUS_KEY_BY_PAYMENT: Record<string, string> = {
  not_paid: "notPaid",
  awaiting: "awaiting",
  captured: "paid",
  partially_refunded: "partiallyRefunded",
  refunded: "refunded",
  canceled: "canceled",
  requires_action: "requiresAction",
}

const resolveStatusKey = (order: HttpTypes.StoreOrder) => {
  if (
    order.fulfillment_status &&
    STATUS_KEY_BY_FULFILLMENT[order.fulfillment_status]
  ) {
    return STATUS_KEY_BY_FULFILLMENT[order.fulfillment_status]
  }

  if (order.payment_status && STATUS_KEY_BY_PAYMENT[order.payment_status]) {
    return STATUS_KEY_BY_PAYMENT[order.payment_status]
  }

  return STATUS_KEY_BY_ORDER_STATUS[order.status] ?? "pending"
}

const OrderCard = ({ order }: OrderCardProps) => {
  const t = useTranslations("account")
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
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-ui-fg-subtle">{t("orderStatus")}</p>
          <Badge color="blue" size="2xsmall" data-testid="order-status">
            {t(`orderStatusValues.${statusKey}`)}
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
