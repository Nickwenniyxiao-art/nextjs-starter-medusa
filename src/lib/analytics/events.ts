type GtagEvent = {
  action: string
  params?: Record<string, unknown>
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function sendEvent({ action, params }: GtagEvent) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", action, params)
}

export function trackViewItem(product: {
  id: string
  name: string
  price?: number
  currency?: string
  category?: string
}) {
  sendEvent({
    action: "view_item",
    params: {
      currency: product.currency || "USD",
      value: product.price || 0,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price || 0,
          item_category: product.category || "",
        },
      ],
    },
  })
}

export function trackAddToCart(item: {
  id: string
  name: string
  price?: number
  currency?: string
  quantity: number
}) {
  sendEvent({
    action: "add_to_cart",
    params: {
      currency: item.currency || "USD",
      value: (item.price || 0) * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price || 0,
          quantity: item.quantity,
        },
      ],
    },
  })
}

export function trackViewItemList(params: {
  item_list_id?: string
  item_list_name: string
  items: Array<{
    id: string
    name: string
    price?: number
    index?: number
  }>
}) {
  sendEvent({
    action: "view_item_list",
    params: {
      item_list_id: params.item_list_id,
      item_list_name: params.item_list_name,
      items: params.items.map((item, idx) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price || 0,
        index: item.index ?? idx,
      })),
    },
  })
}

export function trackBeginCheckout(cart: {
  total: number
  currency: string
  items: Array<{
    id: string
    name: string
    price?: number
    quantity: number
  }>
}) {
  sendEvent({
    action: "begin_checkout",
    params: {
      currency: cart.currency,
      value: cart.total,
      items: cart.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price || 0,
        quantity: item.quantity,
      })),
    },
  })
}

export function trackPurchase(order: {
  transaction_id: string
  value: number
  currency: string
  tax?: number
  shipping?: number
  items: Array<{
    id: string
    name: string
    price?: number
    quantity: number
  }>
}) {
  sendEvent({
    action: "purchase",
    params: {
      transaction_id: order.transaction_id,
      value: order.value,
      currency: order.currency,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price || 0,
        quantity: item.quantity,
      })),
    },
  })
}
