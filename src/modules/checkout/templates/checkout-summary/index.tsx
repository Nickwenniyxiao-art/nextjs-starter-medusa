import { convertToLocale } from "@lib/util/money"
import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import Divider from "@modules/common/components/divider"
import { useTranslations } from "next-intl"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const t = useTranslations("cart")

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          {t("title")}
        </Heading>
        <Divider className="my-6" />
        <div>
          <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
            <div className="flex items-center justify-between">
              <span>{t("subtotal")}</span>
              <span
                data-testid="cart-subtotal"
                data-value={cart.item_subtotal || 0}
              >
                {convertToLocale({
                  amount: cart.item_subtotal ?? 0,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("shipping")}</span>
              <span
                data-testid="cart-shipping"
                data-value={cart.shipping_subtotal || 0}
              >
                {convertToLocale({
                  amount: cart.shipping_subtotal ?? 0,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex gap-x-1 items-center">{t("tax")}</span>
              <span data-testid="cart-taxes" data-value={cart.tax_total || 0}>
                {convertToLocale({
                  amount: cart.tax_total ?? 0,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
          </div>
          <div className="h-px w-full border-b border-gray-200 my-4" />
          <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
            <span>{t("total")}</span>
            <span
              className="txt-xlarge-plus"
              data-testid="cart-total"
              data-value={cart.total || 0}
            >
              {convertToLocale({
                amount: cart.total ?? 0,
                currency_code: cart.currency_code,
              })}
            </span>
          </div>
          <div className="h-px w-full border-b border-gray-200 mt-4" />
        </div>
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
