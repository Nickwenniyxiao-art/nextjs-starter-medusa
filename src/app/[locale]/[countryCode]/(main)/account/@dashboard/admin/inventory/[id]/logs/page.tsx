import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import InventoryLogs from "@modules/account/components/inventory-logs"
import { adminFetch } from "@lib/data/admin"

export default async function InventoryLogsPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>
}) {
  const { countryCode, id } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const data = await adminFetch<{ logs?: any[] }>(`/admin/inventory/${id}/logs`).catch(() => ({ logs: [] }))

  return <InventoryLogs itemId={id} logs={data.logs || []} />
}
