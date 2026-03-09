import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import InventoryTable from "@modules/account/components/inventory-table"
import { redirect } from "next/navigation"

const LIMIT = 50

export default async function AdminInventoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { countryCode } = await params
  const sp = await searchParams

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1)
  const offset = (page - 1) * LIMIT

  const data = await adminFetch<{ inventory_items: any[]; count: number }>(
    "/admin/inventory-items",
    {
      query: {
        limit: LIMIT,
        offset,
        q: sp.q,
        fields: "id,sku,title,*location_levels",
        order: "sku",
      },
    }
  )

  return (
    <InventoryTable
      items={data.inventory_items || []}
      count={data.count || 0}
      page={page}
      pageSize={LIMIT}
    />
  )
}
