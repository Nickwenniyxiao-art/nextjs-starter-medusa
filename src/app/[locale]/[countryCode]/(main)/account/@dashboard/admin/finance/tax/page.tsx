import { fetchTaxRates } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import TaxConfig from "@modules/account/components/tax-config"

export default async function TaxConfigPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const regions = await fetchTaxRates()

  return <TaxConfig initialRegions={regions} />
}
