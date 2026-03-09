import { getAnalyticsData } from "@lib/data/analytics"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import FunnelVisualization from "@modules/account/components/funnel-visualization"

export default async function FunnelPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  const data = await getAnalyticsData(30)
  return <FunnelVisualization funnel={data.funnel} />
}
