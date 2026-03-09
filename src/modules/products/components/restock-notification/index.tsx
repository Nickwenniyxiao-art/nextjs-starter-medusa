"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"
import { useTranslations } from "next-intl"

type RestockNotificationProps = {
  variantId: string
  userEmail?: string
}

const RestockNotification = ({ variantId, userEmail }: RestockNotificationProps) => {
  const t = useTranslations("product")
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState(userEmail || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError(t("invalidEmail"))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/store/restock-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          variant_id: variantId,
          email,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 409 || data?.message?.includes("already")) {
          setIsSubscribed(true)
          setShowForm(false)
          return
        }
        throw new Error(data?.message || t("restockError"))
      }

      setIsSubscribed(true)
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || t("restockError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="w-full text-center py-3 px-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
        ✓ {t("restockSubscribed")}
      </div>
    )
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        variant="secondary"
        className="w-full h-10"
      >
        {t("notifyWhenAvailable")}
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          placeholder={t("enterEmail")}
          className="flex-1 text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#2C3E2D]"
        />
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="h-10 px-4"
          isLoading={isSubmitting}
          disabled={!email || isSubmitting}
        >
          {t("subscribe")}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <button
        onClick={() => {
          setShowForm(false)
          setError(null)
        }}
        className="text-sm text-gray-500 underline text-left"
      >
        {t("cancel")}
      </button>
    </div>
  )
}

export default RestockNotification
