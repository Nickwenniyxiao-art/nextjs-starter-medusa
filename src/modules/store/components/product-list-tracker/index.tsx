"use client"

import { trackViewItemList } from "@lib/analytics/events"
import { useEffect, useRef } from "react"

export default function ProductListTracker({
  listName,
  products,
}: {
  listName: string
  products: Array<{
    id: string
    title: string
  }>
}) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current || products.length === 0) return
    tracked.current = true

    trackViewItemList({
      item_list_name: listName,
      items: products.map((p, idx) => ({
        id: p.id,
        name: p.title,
        index: idx,
      })),
    })
  }, [listName, products])

  return null
}
