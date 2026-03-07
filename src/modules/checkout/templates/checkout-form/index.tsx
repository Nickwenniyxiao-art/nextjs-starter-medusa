import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { ExclamationCircleSolid } from "@medusajs/icons"
import { getLocale, getTranslations } from "next-intl/server"

const CheckoutErrorBoundary = async () => {
  const [t, locale] = await Promise.all([
    getTranslations("checkout"),
    getLocale(),
  ])

  const isZh = locale.startsWith("zh")

  return (
    <div className="w-full rounded-lg border border-rose-200 bg-rose-50 px-6 py-8 text-center">
      <div className="mb-4 flex justify-center text-rose-500">
        <ExclamationCircleSolid className="h-8 w-8" />
      </div>
      <p className="text-lg font-semibold text-rose-700">
        {t.has("errors.apiUnavailable")
          ? t("errors.apiUnavailable")
          : "Payment service is temporarily unavailable"}
      </p>
      <p className="mt-2 text-sm text-rose-600">
        {t.has("errors.tryAgain")
          ? t("errors.tryAgain")
          : "Please refresh and try again."}
      </p>
      <p className="mt-1 text-xs text-rose-500">
        {isZh
          ? "支付服务暂时不可用，请刷新页面后重试。"
          : "Payment service is temporarily unavailable. Please refresh and try again."}
      </p>

      <a
        href="."
        className="mt-6 inline-block rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
      >
        {t.has("errors.refresh") ? t("errors.refresh") : "Refresh"}
      </a>
    </div>
  )
}

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  let shippingMethods
  let paymentMethods

  try {
    shippingMethods = await listCartShippingMethods(cart.id)
    paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  } catch {
    return <CheckoutErrorBoundary />
  }

  if (!shippingMethods || !paymentMethods) {
    return <CheckoutErrorBoundary />
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <CheckoutProgress cart={cart} />
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
