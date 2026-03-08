"use client"

import { trackViewItem } from "@lib/analytics/events"
import { useEffect } from "react"

export default function ProductViewTracker({
  product,
  currency,
}: {
  product: {
    id: string
    title: string
    variants?: Array<{
      calculated_price?: { calculated_amount?: number }
    }> | null
    collection?: { title?: string } | null
  }
  currency?: string
}) {
  useEffect(() => {
    const price = product.variants?.[0]?.calculated_price?.calculated_amount
    trackViewItem({
      id: product.id,
      name: product.title,
      price: price ? price / 100 : undefined,
      currency: currency || "USD",
      category: product.collection?.title || "",
    })
  }, [product.id, product.title, product.variants, product.collection, currency])

  return null
}
