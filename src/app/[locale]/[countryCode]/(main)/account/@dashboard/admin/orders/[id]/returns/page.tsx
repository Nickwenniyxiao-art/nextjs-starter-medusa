import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import OrderReturns from "@modules/account/components/order-returns"

export default async function OrderReturnsPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>
}) {
  const { countryCode, id } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  return <OrderReturns orderId={id} />
}
