import { HttpTypes } from "@medusajs/types"

type ReturnDetail = {
  fulfilled_quantity?: number
  delivered_quantity?: number
  shipped_quantity?: number
  return_requested_quantity?: number
  return_received_quantity?: number
  return_dismissed_quantity?: number
  written_off_quantity?: number
}

export function getReturnableQuantity(item: HttpTypes.StoreOrderLineItem): number {
  const detail = item.detail as ReturnDetail | undefined

  if (!detail) {
    return 0
  }

  const delivered =
    detail.delivered_quantity ??
    detail.shipped_quantity ??
    detail.fulfilled_quantity ??
    0
  const alreadyRequested = detail.return_requested_quantity ?? 0
  const alreadyReceived = detail.return_received_quantity ?? 0
  const writtenOff = detail.written_off_quantity ?? 0

  return Math.max(0, delivered - alreadyRequested - alreadyReceived - writtenOff)
}

export function hasReturnableItems(order: HttpTypes.StoreOrder): boolean {
  if (!order.items || order.items.length === 0) {
    return false
  }

  return order.items.some((item) => getReturnableQuantity(item) > 0)
}

export function getItemsWithReturnInfo(
  items: HttpTypes.StoreOrderLineItem[]
): Array<
  HttpTypes.StoreOrderLineItem & {
    returnable_quantity: number
    is_returnable: boolean
  }
> {
  return items.map((item) => {
    const returnableQty = getReturnableQuantity(item)

    return {
      ...item,
      returnable_quantity: returnableQty,
      is_returnable: returnableQty > 0,
    }
  })
}
