import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import CustomReports from "@modules/account/components/custom-reports"

export default async function CustomReportsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  return <CustomReports />
}
