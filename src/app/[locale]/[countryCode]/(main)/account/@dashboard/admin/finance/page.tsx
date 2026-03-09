import { getFinanceData } from "@lib/data/analytics"
import { isAdmin } from "@lib/util/admin-guard"
import FinanceDashboard from "@modules/account/components/finance-dashboard"
import { redirect } from "next/navigation"

const PAGE_SIZE = 20

export default async function AdminFinancePage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { countryCode } = await params
  const sp = await searchParams

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1)
  const financeData = await getFinanceData(page, PAGE_SIZE)

  return <FinanceDashboard data={financeData} page={page} pageSize={PAGE_SIZE} />
}
