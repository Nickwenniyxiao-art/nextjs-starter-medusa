"use client"

import { trackBeginCheckout } from "@lib/analytics/events"
import { useEffect, useRef } from "react"

export default function CheckoutAnalytics({
  cart,
}: {
  cart: {
    id: string
    total?: number
    currency_code?: string
    items?: Array<{
      id: string
      title: string
      unit_price?: number
      quantity: number
    }>
  }
}) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    trackBeginCheckout({
      total: cart.total ? cart.total / 100 : 0,
      currency: cart.currency_code || "USD",
      items: (cart.items || []).map((item) => ({
        id: item.id,
        name: item.title,
        price: item.unit_price ? item.unit_price / 100 : 0,
        quantity: item.quantity,
      })),
    })
  }, [cart])

  return null
}
