"use client"

import {
  createReturnRequest,
  type ReturnReason,
  type ReturnShippingOption,
} from "@lib/data/returns"
import { getItemsWithReturnInfo } from "@lib/util/returns"
import { convertToLocale } from "@lib/util/money"
import { ArrowLeftMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import { useState } from "react"

type Props = {
  order: HttpTypes.StoreOrder
  returnReasons: ReturnReason[]
  returnShippingOptions: ReturnShippingOption[]
}

interface SelectedItem {
  id: string
  quantity: number
  reason_id: string
  note: string
}

type Step =
  | "select-items"
  | "select-reason"
  | "select-shipping"
  | "confirm"
  | "success"
  | "error"

const steps: Step[] = ["select-items", "select-reason", "select-shipping", "confirm"]

const ReturnRequestTemplate = ({
  order,
  returnReasons,
  returnShippingOptions,
}: Props) => {
  const t = useTranslations("returns")
  const [step, setStep] = useState<Step>("select-items")
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const itemsWithInfo = getItemsWithReturnInfo(order.items || [])
  const returnableItems = itemsWithInfo.filter((i) => i.is_returnable)

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((s) => s.id === itemId)

      if (exists) {
        return prev.filter((s) => s.id !== itemId)
      }

      return [...prev, { id: itemId, quantity: 1, reason_id: "", note: "" }]
    })
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((s) => (s.id === itemId ? { ...s, quantity } : s))
    )
  }

  const updateItemReason = (itemId: string, reason_id: string) => {
    setSelectedItems((prev) =>
      prev.map((s) => (s.id === itemId ? { ...s, reason_id } : s))
    )
  }

  const updateItemNote = (itemId: string, note: string) => {
    setSelectedItems((prev) =>
      prev.map((s) => (s.id === itemId ? { ...s, note } : s))
    )
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setErrorMessage("")

    const result = await createReturnRequest({
      order_id: order.id,
      items: selectedItems.map((s) => ({
        id: s.id,
        quantity: s.quantity,
        ...(s.reason_id ? { reason_id: s.reason_id } : {}),
        ...(s.note ? { note: s.note } : {}),
      })),
      return_shipping: {
        option_id: selectedShippingOptionId,
      },
    })

    setSubmitting(false)

    if (result.success) {
      setStep("success")
      return
    }

    setErrorMessage(result.error || t("submitError"))
    setStep("error")
  }

  if (returnableItems.length === 0) {
    return (
      <div className="flex flex-col gap-y-4">
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="flex items-center gap-x-1 text-sm text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <ArrowLeftMini /> {t("backToOrder")}
        </LocalizedClientLink>
        <div className="rounded-lg border border-ui-border-base p-6 text-center">
          <Text className="text-ui-fg-muted">{t("noReturnableItems")}</Text>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="rounded-lg border border-ui-border-base p-6 text-center">
          <Text className="mb-2 txt-xlarge">✓</Text>
          <Text className="mb-2 txt-medium-plus">{t("successTitle")}</Text>
          <Text className="mb-4 text-ui-fg-subtle">{t("successDescription")}</Text>
          <LocalizedClientLink href="/account/orders">
            <Button variant="secondary">{t("backToOrders")}</Button>
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="rounded-lg border border-ui-border-base p-6 text-center">
          <Text className="mb-2 txt-medium-plus text-ui-fg-error">
            {t("errorTitle")}
          </Text>
          <Text className="mb-4 text-ui-fg-subtle">{errorMessage}</Text>
          <Button variant="secondary" onClick={() => setStep("select-items")}>
            {t("tryAgain")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl-semi">{t("title")}</h1>
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="flex items-center gap-x-1 text-sm text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <ArrowLeftMini /> {t("backToOrder")}
        </LocalizedClientLink>
      </div>

      <Text className="text-ui-fg-subtle">
        {t("orderLabel")} #{order.display_id}
      </Text>

      <div className="mb-2 flex gap-2">
        {steps.map((s, idx) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${
              idx <= steps.indexOf(step) ? "bg-ui-fg-interactive" : "bg-ui-border-base"
            }`}
          />
        ))}
      </div>

      {step === "select-items" && (
        <div className="flex flex-col gap-y-3">
          <Text className="txt-medium-plus">{t("selectItemsTitle")}</Text>
          <Text className="text-sm text-ui-fg-subtle">{t("selectItemsDescription")}</Text>

          {returnableItems.map((item) => {
            const selected = selectedItems.find((s) => s.id === item.id)

            return (
              <div
                key={item.id}
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                  selected
                    ? "border-ui-fg-interactive bg-ui-bg-interactive"
                    : "border-ui-border-base hover:border-ui-border-strong"
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-3">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <Text className="txt-compact-medium">{item.product_title}</Text>
                      <Text className="text-sm text-ui-fg-subtle">
                        {item.variant_title}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="text-sm text-ui-fg-subtle">
                      {t("maxQuantity")}: {item.returnable_quantity}
                    </Text>
                    {selected && (
                      <select
                        value={selected.quantity}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateItemQuantity(item.id, Number.parseInt(e.target.value, 10))
                        }
                        className="mt-1 rounded border border-ui-border-base px-2 py-1 text-sm"
                      >
                        {Array.from(
                          { length: item.returnable_quantity },
                          (_, i) => i + 1
                        ).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          <Button
            onClick={() => setStep("select-reason")}
            disabled={selectedItems.length === 0}
            className="mt-2"
          >
            {t("continue")}
          </Button>
        </div>
      )}

      {step === "select-reason" && (
        <div className="flex flex-col gap-y-3">
          <Text className="txt-medium-plus">{t("selectReasonTitle")}</Text>

          {selectedItems.map((sel) => {
            const item = itemsWithInfo.find((i) => i.id === sel.id)

            if (!item) {
              return null
            }

            return (
              <div key={sel.id} className="rounded-lg border border-ui-border-base p-4">
                <Text className="mb-2 txt-compact-medium">
                  {item.product_title} — {item.variant_title} × {sel.quantity}
                </Text>

                {returnReasons.length > 0 ? (
                  <select
                    value={sel.reason_id}
                    onChange={(e) => updateItemReason(sel.id, e.target.value)}
                    className="mb-2 w-full rounded border border-ui-border-base px-3 py-2 text-sm"
                  >
                    <option value="">{t("selectReason")}</option>
                    {returnReasons.map((reason) => (
                      <option key={reason.id} value={reason.id}>
                        {reason.label || reason.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Text className="mb-2 text-sm text-ui-fg-muted">
                    {t("noReasonsConfigured")}
                  </Text>
                )}

                <textarea
                  placeholder={t("notePlaceholder")}
                  value={sel.note}
                  onChange={(e) => updateItemNote(sel.id, e.target.value)}
                  className="w-full rounded border border-ui-border-base px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
            )
          })}

          <div className="mt-2 flex gap-2">
            <Button variant="secondary" onClick={() => setStep("select-items")}>
              {t("back")}
            </Button>
            <Button onClick={() => setStep("select-shipping")}>{t("continue")}</Button>
          </div>
        </div>
      )}

      {step === "select-shipping" && (
        <div className="flex flex-col gap-y-3">
          <Text className="txt-medium-plus">{t("selectShippingTitle")}</Text>

          {returnShippingOptions.length > 0 ? (
            returnShippingOptions.map((option) => (
              <div
                key={option.id}
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                  selectedShippingOptionId === option.id
                    ? "border-ui-fg-interactive bg-ui-bg-interactive"
                    : "border-ui-border-base hover:border-ui-border-strong"
                }`}
                onClick={() => setSelectedShippingOptionId(option.id)}
              >
                <div className="flex items-center justify-between">
                  <Text className="txt-compact-medium">{option.name}</Text>
                  <Text>
                    {option.amount === 0
                      ? t("freeShipping")
                      : convertToLocale({
                          amount: option.amount,
                          currency_code: order.currency_code,
                        })}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-ui-border-base p-4">
              <Text className="text-sm text-ui-fg-muted">{t("noShippingOptions")}</Text>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <Button variant="secondary" onClick={() => setStep("select-reason")}>
              {t("back")}
            </Button>
            <Button
              onClick={() => setStep("confirm")}
              disabled={returnShippingOptions.length > 0 && !selectedShippingOptionId}
            >
              {t("continue")}
            </Button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-y-3">
          <Text className="txt-medium-plus">{t("confirmTitle")}</Text>

          <div className="rounded-lg border border-ui-border-base p-4">
            <Text className="mb-2 txt-compact-medium">{t("returnItems")}</Text>
            {selectedItems.map((sel) => {
              const item = itemsWithInfo.find((i) => i.id === sel.id)

              if (!item) {
                return null
              }

              const reason = returnReasons.find((r) => r.id === sel.reason_id)

              return (
                <div
                  key={sel.id}
                  className="flex justify-between border-b border-ui-border-base py-2 last:border-0"
                >
                  <div>
                    <Text className="text-sm">{item.product_title}</Text>
                    <Text className="text-xs text-ui-fg-subtle">
                      {item.variant_title} × {sel.quantity}
                    </Text>
                    {reason && (
                      <Text className="text-xs text-ui-fg-subtle">
                        {t("reason")}: {reason.label || reason.value}
                      </Text>
                    )}
                    {sel.note && (
                      <Text className="text-xs text-ui-fg-subtle">
                        {t("note")}: {sel.note}
                      </Text>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedShippingOptionId && (
            <div className="rounded-lg border border-ui-border-base p-4">
              <Text className="txt-compact-medium">{t("returnShipping")}</Text>
              <Text className="text-sm text-ui-fg-subtle">
                {
                  returnShippingOptions.find((o) => o.id === selectedShippingOptionId)
                    ?.name
                }
              </Text>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <Button variant="secondary" onClick={() => setStep("select-shipping")}>
              {t("back")}
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              {t("submitReturn")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnRequestTemplate
