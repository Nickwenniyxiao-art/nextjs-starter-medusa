"use client"

import { trackPurchase } from "@lib/analytics/events"
import { useEffect, useRef } from "react"

type OrderData = {
  id: string
  total?: number
  tax_total?: number
  shipping_total?: number
  currency_code: string
  items?: Array<{
    id: string
    title: string
    unit_price?: number
    quantity: number
  }>
}

export default function PurchaseTracker({ order }: { order: OrderData }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    trackPurchase({
      transaction_id: order.id,
      value: order.total ? order.total / 100 : 0,
      currency: order.currency_code || "USD",
      tax: order.tax_total ? order.tax_total / 100 : 0,
      shipping: order.shipping_total ? order.shipping_total / 100 : 0,
      items: (order.items || []).map((item) => ({
        id: item.id,
        name: item.title,
        price: item.unit_price ? item.unit_price / 100 : 0,
        quantity: item.quantity,
      })),
    })
  }, [order])

  return null
}
