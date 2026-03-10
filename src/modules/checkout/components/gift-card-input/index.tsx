"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Input, Button, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import ErrorMessage from "../error-message"

type GiftCardInputProps = {
  cart: HttpTypes.StoreCart
}

const GiftCardInput = ({ cart }: GiftCardInputProps) => {
  const t = useTranslations("checkout")
  const [code, setCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const giftCards = (cart as any)?.gift_cards || []

  const handleRemove = async (gcCode: string) => {
    try {
      const remaining = giftCards.filter((gc: any) => gc.code !== gcCode)
      await fetch(`/api/store/carts/${cart.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gift_cards: remaining.map((gc: any) => ({ code: gc.code })) }),
      })
      window.location.reload()
    } catch (e: any) {
      setError(e.message || t("giftCard.error"))
    }
  }

  const handleApply = async () => {
    if (!code.trim()) return
    setIsApplying(true)
    setError(null)
    try {
      const response = await fetch(`/api/store/carts/${cart.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_cards: [...giftCards.map((gc: any) => ({ code: gc.code })), { code: code.trim() }],
        }),
      })
      if (!response.ok) throw new Error(t("giftCard.invalidCode"))
      setCode("")
      window.location.reload()
    } catch (e: any) {
      setError(e.message || t("giftCard.error"))
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <Text className="txt-medium-plus text-ui-fg-base mb-2">{t("giftCard.title")}</Text>
      <div className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("giftCard.placeholder")} className="flex-1" data-testid="gift-card-input" />
        <Button variant="secondary" onClick={handleApply} disabled={!code.trim() || isApplying} isLoading={isApplying} data-testid="gift-card-apply-btn">{t("applyButton")}</Button>
      </div>
      {(cart as any)?.gift_cards?.length > 0 && (
        <div className="mt-3 space-y-2">
          {giftCards.map((gc: any) => (
            <div key={gc.id} className="flex items-center justify-between bg-green-50 rounded px-3 py-2 text-sm">
              <div>
                <span className="font-medium text-green-700">{gc.code}</span>
                <span className="text-green-600 ml-2">-{convertToLocale({ amount: gc.balance || 0, currency_code: cart.currency_code })}</span>
              </div>
              <button onClick={() => handleRemove(gc.code)} className="text-red-500 hover:text-red-700 text-xs">{t("giftCard.remove")}</button>
            </div>
          ))}
        </div>
      )}
      {error && <ErrorMessage error={error} data-testid="gift-card-error" />}
    </div>
  )
}

export default GiftCardInput
