import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"
import ReturnRequestForm from "@modules/account/components/return-request-form"

export default async function NewReturnPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ order_id?: string }>
}) {
  const { countryCode } = await params
  const sp = await searchParams
  const customer = await retrieveCustomer()
  if (!customer) {
    redirect(`/${countryCode}/account`)
  }
  return <ReturnRequestForm orderId={sp.order_id} />
}
