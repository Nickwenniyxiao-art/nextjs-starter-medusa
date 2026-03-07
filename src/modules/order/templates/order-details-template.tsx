"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import { useLocale, useTranslations } from "next-intl"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const statusSteps = ["pending", "processing", "shipped", "delivered"] as const

const getProgressStatus = (order: HttpTypes.StoreOrder) => {
  if (order.fulfillment_status === "delivered") {
    return "delivered"
  }

  if (
    order.fulfillment_status === "fulfilled" ||
    order.fulfillment_status === "shipped"
  ) {
    return "shipped"
  }

  if (order.payment_status === "captured") {
    return "processing"
  }

  return "pending"
}

const getPaymentStatusKey = (status?: string | null) => {
  if (!status) {
    return "pending"
  }

  if (["authorized", "captured", "refunded", "pending"].includes(status)) {
    return status
  }

  return "pendingConfirmation"
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const t = useTranslations("order")
  const locale = useLocale()

  const currentStatus = getProgressStatus(order)
  const currentStepIndex = statusSteps.indexOf(currentStatus)
  const trackingNumber = (order.fulfillments?.[0] as any)?.tracking_number
  const payment = order.payment_collections?.[0]?.payments?.[0]

  const timeline = [
    {
      label: t.has("timelineCreated") ? t("timelineCreated") : "Created",
      date: order.created_at,
    },
    {
      label: t.has("timelinePaid") ? t("timelinePaid") : "Paid",
      date: payment?.created_at,
    },
    {
      label: t.has("timelineShipped") ? t("timelineShipped") : "Shipped",
      date: order.fulfillments?.[0]?.created_at,
    },
    {
      label: t.has("timelineUpdated") ? t("timelineUpdated") : "Last update",
      date: order.updated_at,
    },
  ].filter((entry) => entry.date)

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">{t("viewDetails")}</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <XMark /> {t("backToOverview")}
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />

        <div className="rounded-lg border border-ui-border-base p-4">
          <Text className="txt-medium-plus mb-3">{t.has("statusProgressTitle") ? t("statusProgressTitle") : t("statusProgress.pending")}</Text>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${idx <= currentStepIndex ? "bg-ui-fg-interactive" : "bg-ui-border-base"}`}
                />
                <Text className={idx <= currentStepIndex ? "text-ui-fg-base" : "text-ui-fg-muted"}>
                  {t.has(`statusProgress.${step}`) ? t(`statusProgress.${step}`) : step}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {trackingNumber && (
          <div className="rounded-lg border border-ui-border-base p-4">
            <Text className="txt-medium-plus">{t.has("trackingNumber") ? t("trackingNumber") : "Tracking number"}</Text>
            <Text className="text-ui-fg-subtle" data-testid="tracking-number">{trackingNumber}</Text>
          </div>
        )}

        <div className="rounded-lg border border-ui-border-base p-4">
          <Text className="txt-medium-plus mb-2">{t.has("paymentInfo") ? t("paymentInfo") : "Payment"}</Text>
          <Badge>
            {t.has(`paymentStatus.${getPaymentStatusKey(order.payment_status)}`)
              ? t(`paymentStatus.${getPaymentStatusKey(order.payment_status)}`)
              : t("paymentStatus.pending")}
          </Badge>
        </div>

        <div className="rounded-lg border border-ui-border-base p-4">
          <Text className="txt-medium-plus mb-3">{t.has("timeline") ? t("timeline") : "Timeline"}</Text>
          <div className="space-y-2">
            {timeline.map((entry) => (
              <div key={entry.label} className="flex items-center justify-between text-sm">
                <Text className="text-ui-fg-subtle">{entry.label}</Text>
                <Text>{new Date(entry.date as string).toLocaleString(locale)}</Text>
              </div>
            ))}
          </div>
        </div>

        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
