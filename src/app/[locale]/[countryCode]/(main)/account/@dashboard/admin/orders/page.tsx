import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import AdminOrdersTable from "@modules/account/components/admin-orders-table"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

const LIMIT = 20

export default async function AdminOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string; status?: string; q?: string }>
}) {
  const { countryCode } = await params
  const sp = await searchParams

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1)
  const offset = (page - 1) * LIMIT
  const t = await getTranslations("admin")

  try {
    const data = await adminFetch<{ orders: any[]; count: number }>("/admin/orders", {
      query: {
        limit: LIMIT,
        offset,
        status: sp.status,
        q: sp.q,
        fields:
          "id,display_id,status,total,currency_code,fulfillment_status,payment_status,created_at,email,*shipping_address",
        order: "-created_at",
      },
    })

    return <AdminOrdersTable orders={data.orders || []} count={data.count || 0} page={page} pageSize={LIMIT} />
  } catch {
    return <div className="text-ui-fg-error">{t("noOrdersFound")}</div>
  }
}
