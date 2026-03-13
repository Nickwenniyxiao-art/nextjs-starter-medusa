import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import CurrencyReport from "@modules/account/components/currency-report"

export default async function CurrencyReportPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  return <CurrencyReport />
}
