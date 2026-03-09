import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import InventoryAlerts from "@modules/account/components/inventory-alerts"

const LIMIT = 100

export default async function InventoryAlertsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  const data = await adminFetch<{ inventory_items: any[]; count: number }>(
    "/admin/inventory-items",
    {
      query: {
        limit: LIMIT,
        offset: 0,
        fields: "id,sku,title,*location_levels",
        order: "sku",
      },
    }
  )
  return <InventoryAlerts items={data.inventory_items || []} />
}
