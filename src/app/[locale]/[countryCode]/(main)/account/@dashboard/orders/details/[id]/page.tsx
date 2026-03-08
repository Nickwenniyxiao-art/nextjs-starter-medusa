import { retrieveCustomer } from "@lib/data/customer"
import { retrieveOrder } from "@lib/data/orders"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Order #${order.display_id}`,
    description: `View your order timeline, shipping and payment status`,
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    redirect(
      `/${params.countryCode}/account?redirect=orders/details/${params.id}`
    )
  }

  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return <OrderDetailsTemplate order={order} />
}
