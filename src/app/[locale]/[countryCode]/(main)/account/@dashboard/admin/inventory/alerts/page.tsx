import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import InventoryAlerts from "@modules/account/components/inventory-alerts"

export default async function InventoryAlertsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const data = await adminFetch<{ alerts?: any[] }>("/admin/inventory/low-stock-alerts").catch(() => ({ alerts: [] }))

  return <InventoryAlerts items={data.alerts || []} />
}
