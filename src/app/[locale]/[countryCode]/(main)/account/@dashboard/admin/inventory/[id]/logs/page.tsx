import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import InventoryLogs from "@modules/account/components/inventory-logs"

export default async function InventoryLogsPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>
}) {
  const { countryCode, id } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  return <InventoryLogs itemId={id} />
}
