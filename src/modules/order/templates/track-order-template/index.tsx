"use client"

import { useActionState } from "react"
import { useTranslations } from "next-intl"
import { Button, Heading, Text } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import OrderStatusDisplay from "./order-status-display"
import { TrackOrderState, trackOrderAction } from "./actions"

const initialState: TrackOrderState = {
  order: null,
  error: null,
}

const TrackOrderTemplate = ({ countryCode }: { countryCode: string }) => {
  const t = useTranslations("trackOrder")
  const [state, formAction, isPending] = useActionState(
    trackOrderAction,
    initialState
  )

  return (
    <div className="content-container py-12 bg-[#FAFAF8] min-h-[60vh]" data-country={countryCode}>
      <div className="max-w-lg mx-auto">
        <Heading level="h1" className="text-2xl-semi mb-4 text-[#2C3E2D]">
          {t("title")}
        </Heading>
        <Text className="text-base-regular text-ui-fg-subtle mb-8">
          {t("description")}
        </Text>

        <form action={formAction} className="flex flex-col gap-y-4">
          <Input
            label={t("orderIdLabel")}
            name="order_id"
            required
            data-testid="track-order-id-input"
          />
          <Input
            label={t("emailLabel")}
            name="email"
            type="email"
            required
            data-testid="track-order-email-input"
          />

          {state.error && (
            <Text
              className="text-rose-500 text-small-regular"
              data-testid="track-order-error"
            >
              {state.error === "emailMismatch"
                ? t("emailMismatch")
                : t("orderNotFound")}
            </Text>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2"
            data-testid="track-order-submit"
          >
            {isPending ? t("searching") : t("submit")}
          </Button>
        </form>

        {state.order && (
          <div className="mt-8" data-testid="track-order-result">
            <OrderStatusDisplay order={state.order} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrderTemplate
