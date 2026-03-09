import { getAnalyticsData } from "@lib/data/analytics"
import { isAdmin } from "@lib/util/admin-guard"
import AnalyticsDashboard from "@modules/account/components/analytics-dashboard"
import { redirect } from "next/navigation"

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const analyticsData = await getAnalyticsData(90)

  return <AnalyticsDashboard data={analyticsData} />
}
