"use client"

import { CheckCircleMiniSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

type CheckoutProgressProps = {
  cart: HttpTypes.StoreCart
}

type ProgressStep = {
  id: "shipping" | "payment" | "review"
  label: string
  isCurrent: boolean
  isCompleted: boolean
}

const CheckoutProgress = ({ cart }: CheckoutProgressProps) => {
  const t = useTranslations("checkout")
  const searchParams = useSearchParams()

  const stepParam = searchParams?.get("step")

  const shippingCompleted =
    !!cart.shipping_address && (cart.shipping_methods?.length ?? 0) > 0

  const paidByGiftcard =
    (cart as any)?.gift_cards &&
    (cart as any)?.gift_cards?.length > 0 &&
    cart?.total === 0

  const paymentCompleted =
    !!cart.payment_collection?.payment_sessions?.find(
      (paymentSession) => paymentSession.status === "pending"
    ) || paidByGiftcard

  const currentStep: ProgressStep["id"] = (() => {
    if (stepParam === "payment") {
      return "payment"
    }

    if (stepParam === "review") {
      return "review"
    }

    return "shipping"
  })()

  const steps: ProgressStep[] = [
    {
      id: "shipping",
      label: t("progress.shipping"),
      isCurrent: currentStep === "shipping",
      isCompleted: shippingCompleted || currentStep !== "shipping",
    },
    {
      id: "payment",
      label: t("progress.payment"),
      isCurrent: currentStep === "payment",
      isCompleted: paymentCompleted || currentStep === "review",
    },
    {
      id: "review",
      label: t("progress.review"),
      isCurrent: currentStep === "review",
      isCompleted: false,
    },
  ]

  const currentStepIndex =
    steps.findIndex((step) => step.id === currentStep) + 1

  return (
    <div className="mb-8" data-testid="checkout-progress">
      <div className="small:hidden">
        <Text className="txt-small text-ui-fg-subtle mb-2">
          {t("progress.stepCount", {
            current: currentStepIndex,
            total: steps.length,
          })}
        </Text>
        <Text className="txt-compact-medium-plus">
          {steps[currentStepIndex - 1].label}
        </Text>
      </div>

      <ol
        className="hidden small:flex items-center gap-x-3"
        aria-label={t("progress.label")}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-x-2">
                <span
                  className={clx(
                    "flex h-7 w-7 items-center justify-center rounded-full border",
                    {
                      "border-ui-fg-interactive bg-ui-fg-interactive text-ui-bg-base":
                        step.isCurrent,
                      "border-green-600 bg-green-600 text-white":
                        step.isCompleted && !step.isCurrent,
                      "border-ui-border-base text-ui-fg-subtle":
                        !step.isCurrent && !step.isCompleted,
                    }
                  )}
                >
                  {step.isCompleted && !step.isCurrent ? (
                    <CheckCircleMiniSolid className="h-4 w-4" />
                  ) : (
                    <Text size="small" leading="compact" weight="plus">
                      {index + 1}
                    </Text>
                  )}
                </span>
                <Text
                  className={clx("txt-small truncate", {
                    "text-ui-fg-base": step.isCurrent,
                    "text-ui-fg-subtle": !step.isCurrent,
                  })}
                >
                  {step.label}
                </Text>
              </div>

              {!isLast && (
                <span
                  className="mx-3 h-px flex-1 bg-ui-border-base"
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default CheckoutProgress
