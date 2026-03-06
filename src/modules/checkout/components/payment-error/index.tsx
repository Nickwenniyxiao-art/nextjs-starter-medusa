"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import ErrorMessage from "../error-message"

type PaymentErrorProps = {
  error?: string | null
  code?: string | null
  "data-testid"?: string
}

const stripeErrorCodeMap: Record<string, string> = {
  card_declined: "paymentErrors.codes.card_declined",
  insufficient_funds: "paymentErrors.codes.insufficient_funds",
  expired_card: "paymentErrors.codes.expired_card",
  incorrect_cvc: "paymentErrors.codes.incorrect_cvc",
  processing_error: "paymentErrors.codes.processing_error",
  authentication_required: "paymentErrors.codes.authentication_required",
}

const PaymentError = ({
  error,
  code,
  "data-testid": dataTestId,
}: PaymentErrorProps) => {
  const t = useTranslations("checkout")

  const message = useMemo(() => {
    const normalizedCode =
      code ||
      error?.match(
        /(card_declined|insufficient_funds|expired_card|incorrect_cvc|processing_error|authentication_required)/
      )?.[0]

    if (normalizedCode && stripeErrorCodeMap[normalizedCode]) {
      return `${t("paymentErrors.title")}: ${t(
        stripeErrorCodeMap[normalizedCode]
      )}`
    }

    if (!error) {
      return null
    }

    return `${t("paymentErrors.title")}: ${error}`
  }, [code, error, t])

  return <ErrorMessage error={message} data-testid={dataTestId} />
}

export default PaymentError
