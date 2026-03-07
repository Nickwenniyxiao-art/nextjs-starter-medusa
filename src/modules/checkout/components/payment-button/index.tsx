"use client"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import { useTranslations } from "next-intl"
import PaymentError from "../payment-error"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const t = useTranslations("checkout")
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
          t={t}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton
          notReady={notReady}
          data-testid={dataTestId}
          t={t}
        />
      )
    default:
      return <Button disabled>{t("paymentMethod")}</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
  t,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
  t: (key: string) => string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    setErrorCode(null)

    if (
      !stripe ||
      !elements ||
      !card ||
      !cart ||
      !session?.data.client_secret
    ) {
      setErrorMessage(t("paymentErrors.notReady"))
      setSubmitting(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      session.data.client_secret as string,
      {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      }
    )

    if (error) {
      const pi = error.payment_intent

      if (
        (pi && pi.status === "requires_capture") ||
        (pi && pi.status === "succeeded")
      ) {
        return onPaymentCompleted()
      }

      if (
        error.type === "card_error" &&
        error.code === "authentication_required"
      ) {
        setErrorMessage(t("paymentErrors.authenticationRequired"))
      } else if (
        error.type === "api_connection_error" ||
        error.code === "network_error" ||
        error.code === "timeout"
      ) {
        setErrorMessage(
          t("paymentErrors.network")
        )
      } else {
        setErrorMessage(error.message || t("paymentErrors.generic"))
      }
      setErrorCode(error.code || null)
      setSubmitting(false)
      return
    }

    if (
      (paymentIntent && paymentIntent.status === "requires_capture") ||
      paymentIntent?.status === "succeeded"
    ) {
      return onPaymentCompleted()
    }

    if (paymentIntent?.status === "requires_action") {
      setErrorMessage(t("paymentErrors.authenticationRequired"))
      setErrorCode("authentication_required")
    }

    setSubmitting(false)
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        {submitting ? t("processingPayment") : t("placeOrder")}
      </Button>
      <PaymentError
        error={errorMessage}
        code={errorCode}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  t,
}: {
  notReady: boolean
  t: (key: string) => string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        {submitting ? t("processingPayment") : t("placeOrder")}
      </Button>
      <PaymentError
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
