"use client"

import { useTranslations } from "next-intl"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  const t = useTranslations("account")

  if (orders?.length) {
    return (
      <div className="flex w-full flex-col gap-y-3" data-testid="orders-list">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-rounded border border-dashed border-ui-border-base p-8 text-center"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">{t("noOrdersTitle")}</h2>
      <p className="mt-2 text-base-regular text-ui-fg-subtle">
        {t("noOrdersDescription")}
      </p>
      <LocalizedClientLink
        href="/"
        className="mt-4 inline-flex text-small-plus text-ui-fg-interactive"
        data-testid="continue-shopping-button"
      >
        {t("continueShopping")}
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
