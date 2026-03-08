import { retrieveOrder } from "@lib/data/orders"
import { listReturnReasons, listReturnShippingOptions } from "@lib/data/returns"
import ReturnRequestTemplate from "@modules/order/templates/return-request-template"
import { HttpTypes } from "@medusajs/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

type StoreOrderWithCart = HttpTypes.StoreOrder & {
  cart?: { id?: string }
  cart_id?: string
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Request Return — Order #${order.display_id}`,
    description: "Request a return for your order items",
  }
}

export default async function ReturnRequestPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  const returnReasons = await listReturnReasons()

  const orderWithCart = order as StoreOrderWithCart
  const cartId = orderWithCart.cart?.id || orderWithCart.cart_id
  let returnShippingOptions: Awaited<
    ReturnType<typeof listReturnShippingOptions>
  > = []

  if (cartId) {
    returnShippingOptions = await listReturnShippingOptions(cartId)
  }

  return (
    <ReturnRequestTemplate
      order={order}
      returnReasons={returnReasons}
      returnShippingOptions={returnShippingOptions}
    />
  )
}
