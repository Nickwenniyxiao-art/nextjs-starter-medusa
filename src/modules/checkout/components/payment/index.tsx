"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard, Loader } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import PaymentError from "@modules/checkout/components/payment-error"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const t = useTranslations("checkout")
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [isSwitchingMethod, setIsSwitchingMethod] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const getPaymentMethodLabel = (providerId?: string) => {
    if (!providerId) {
      return t("paymentMethods.fallback")
    }

    if (
      providerId === "pp_stripe_stripe" ||
      providerId === "pp_medusa-payments_default"
    ) {
      return t("paymentMethods.creditCard")
    }

    if (providerId === "pp_stripe-ideal_stripe") {
      return t("paymentMethods.ideal")
    }

    if (providerId === "pp_stripe-bancontact_stripe") {
      return t("paymentMethods.bancontact")
    }

    if (providerId === "pp_paypal_paypal") {
      return t("paymentMethods.paypal")
    }

    if (providerId === "pp_system_default") {
      return t("paymentMethods.manual")
    }

    return paymentInfoMap[providerId]?.title || providerId
  }

  const localizedPaymentInfoMap = Object.fromEntries(
    Object.entries(paymentInfoMap).map(([providerId, info]) => [
      providerId,
      {
        ...info,
        title: getPaymentMethodLabel(providerId),
      },
    ])
  )

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    if (!isStripeLike(method)) {
      return
    }

    setIsSwitchingMethod(true)

    try {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    } catch {
      setError(t.has("errors.apiUnavailable") ? t("errors.apiUnavailable") : "Payment service is temporarily unavailable, please refresh and try again")
    } finally {
      setIsSwitchingMethod(false)
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (t.has("errors.apiUnavailable")
            ? t("errors.apiUnavailable")
            : "Payment service is temporarily unavailable, please refresh and try again")
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          {t("payment")}
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              {t("edit")}
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && isSwitchingMethod && (
            <div className="mt-4 flex items-center gap-2 text-ui-fg-subtle" data-testid="payment-method-loading">
              <Loader className="animate-spin" />
              <Text>{t.has("errors.loadingPayment") ? t("errors.loadingPayment") : "Loading payment methods..."}</Text>
            </div>
          )}

          {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={localizedPaymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={localizedPaymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {!paidByGiftcard && availablePaymentMethods?.length === 0 && (
            <div
              className="mt-4 rounded-rounded border border-ui-border-base p-4"
              data-testid="payment-methods-empty-state"
            >
              <Text className="txt-medium-plus text-ui-fg-base">
                {t.has("errors.noPaymentForRegion") ? t("errors.noPaymentForRegion") : t("noPaymentMethodsTitle")}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle mt-1">
                {t("noPaymentMethodsDescription")}
              </Text>
            </div>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t("paymentDetails")}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <PaymentError
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeLike(selectedPaymentMethod)
              ? t("enterCardDetails")
              : t("review")}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {t("paymentMethod")}
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {getPaymentMethodLabel(activeSession?.provider_id)}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {t("paymentDetails")}
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {localizedPaymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : t("anotherStep")}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t("paymentMethod")}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
