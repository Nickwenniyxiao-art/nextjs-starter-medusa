import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import { cookies as nextCookies } from "next/headers"
import { getLocale, getTranslations } from "next-intl/server"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

const getPaymentSummary = (order: HttpTypes.StoreOrder, t: any) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  if (!payment) {
    return t.has("manualPayment") ? t("manualPayment") : "Manual payment"
  }

  const last4 = (payment.data as Record<string, string> | undefined)?.card_last4

  if (last4) {
    const brand = (payment.data as Record<string, string> | undefined)?.card_brand || "Card"
    return `${brand} ${t.has("cardEnding") ? t("cardEnding", { last4 }) : `ending ${last4}`}`
  }

  return t.has("manualPayment") ? t("manualPayment") : "Manual payment"
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const [t, locale] = await Promise.all([getTranslations("order"), getLocale()])

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const orderStatusKey =
    order.fulfillment_status === "fulfilled" ||
    order.fulfillment_status === "shipped"
      ? order.fulfillment_status
      : order.status === "completed" || order.status === "canceled"
      ? order.status
      : "pending"

  const shippingMethod = order.shipping_methods?.[0]
  const estimatedDays = (shippingMethod?.data as Record<string, unknown> | undefined)?.estimated_days as string | number | undefined

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-6 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-2"
          >
            <span>{t("thankYou")}</span>
            <span>{t("orderConfirmed")}</span>
          </Heading>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-ui-fg-subtle">{t("orderNumber")}</p>
              <p data-testid="order-id">#{order.display_id}</p>
            </div>
            <div>
              <p className="text-ui-fg-subtle">{t("orderDate")}</p>
              <p data-testid="order-date">
                {new Date(order.created_at).toLocaleDateString(locale)}
              </p>
            </div>
            <div>
              <p className="text-ui-fg-subtle">{t("orderStatus")}</p>
              <p data-testid="order-status">{t(`status.${orderStatusKey}`)}</p>
            </div>
            <div>
              <p className="text-ui-fg-subtle">{t("orderTotal")}</p>
              <p data-testid="order-total">
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </p>
            </div>
          </div>

          <div>
            <Heading level="h2" className="flex flex-row text-3xl-regular mb-4">
              {t.has("items") ? t("items") : "Items"}
            </Heading>
            <Items order={order} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-ui-border-base p-4">
              <Text className="txt-medium-plus mb-2">{t.has("shippingInfo") ? t("shippingInfo") : t("shippingAddress")}</Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {order.shipping_address?.first_name} {order.shipping_address?.last_name}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">{order.shipping_address?.address_1}</Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {order.shipping_address?.postal_code} {order.shipping_address?.city}
              </Text>
              {estimatedDays && (
                <Text className="txt-medium text-ui-fg-subtle mt-2" data-testid="estimated-delivery">
                  {t.has("estimatedDelivery") ? t("estimatedDelivery") : "Estimated delivery"}: {t.has("businessDays") ? t("businessDays", { days: estimatedDays }) : `${estimatedDays} business days`}
                </Text>
              )}
            </div>
            <div className="rounded-lg border border-ui-border-base p-4">
              <Text className="txt-medium-plus mb-2">{t.has("paymentInfo") ? t("paymentInfo") : t("paymentMethod")}</Text>
              <Text className="txt-medium text-ui-fg-subtle" data-testid="payment-summary">
                {getPaymentSummary(order, t)}
              </Text>
            </div>
          </div>

          <CartTotals totals={order} />

          <div className="pt-2">
            <LocalizedClientLink href="/store">
              <Button size="large" data-testid="continue-shopping-button">
                {t("continueShopping")}
              </Button>
            </LocalizedClientLink>
          </div>

          <Help />
        </div>
      </div>
    </div>
  )
}
