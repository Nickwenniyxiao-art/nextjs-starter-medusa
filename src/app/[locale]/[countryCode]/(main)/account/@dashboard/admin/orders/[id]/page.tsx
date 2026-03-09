import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import AdminOrderDetail from "@modules/account/components/admin-order-detail"
import { notFound, redirect } from "next/navigation"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>
}) {
  const { countryCode, id } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  try {
    const data = await adminFetch<{ order: any }>(`/admin/orders/${id}`, {
      query: {
        fields:
          "*items,*items.variant,*items.product,+items.detail,*fulfillments,*fulfillments.items,*payment_collections,*payment_collections.payments,*shipping_address,*billing_address,*returns,*exchanges,*claims",
      },
    })

    if (!data?.order) notFound()
    return <AdminOrderDetail order={data.order} />
  } catch {
    notFound()
  }
}
