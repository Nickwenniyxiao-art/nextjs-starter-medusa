"use server"

import { retrieveOrder } from "@lib/data/orders"
import { HttpTypes } from "@medusajs/types"

export type TrackOrderState = {
  order: HttpTypes.StoreOrder | null
  error: "orderNotFound" | "emailMismatch" | null
}

export async function trackOrderAction(
  _currentState: TrackOrderState,
  formData: FormData
): Promise<TrackOrderState> {
  const orderId = (formData.get("order_id") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()

  if (!orderId || !email) {
    return { order: null, error: "orderNotFound" }
  }

  const order = await retrieveOrder(orderId).catch(() => null)

  if (!order) {
    return { order: null, error: "orderNotFound" }
  }

  if (order.email?.toLowerCase() !== email) {
    return { order: null, error: "emailMismatch" }
  }

  return { order, error: null }
}
