"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useLocale, useTranslations } from "next-intl"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const getOrderStatusKey = (order: HttpTypes.StoreOrder) => {
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

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const t = useTranslations("order")
  const locale = useLocale()

  return (
    <div>
      <Text>{t("confirmationEmail", { email: order.email })}</Text>
      <Text className="mt-2">
        {t("orderDate")}:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString(locale)}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {t("orderNumber")}:{" "}
        <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <Text>
            {t("orderStatus")}:{" "}
            <span className="text-ui-fg-subtle" data-testid="order-status">
              {t(`status.${getOrderStatusKey(order)}`)}
            </span>
          </Text>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
