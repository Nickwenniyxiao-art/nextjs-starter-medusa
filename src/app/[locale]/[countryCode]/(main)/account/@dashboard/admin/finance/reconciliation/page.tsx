import { fetchReconciliation } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import ReconciliationView from "@modules/account/components/reconciliation-view"

export default async function ReconciliationPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const records = await fetchReconciliation()

  return <ReconciliationView records={records} />
}
