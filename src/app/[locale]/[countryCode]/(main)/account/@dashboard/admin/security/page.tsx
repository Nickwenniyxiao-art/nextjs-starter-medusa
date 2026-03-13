import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"

export default async function SecurityOverviewPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const [health, events] = await Promise.all([
    adminFetch<{ checks?: Record<string, boolean> }>("/admin/security/health-check").catch(() => ({ checks: {} })),
    adminFetch<{ summary?: { label: string; count: number }[] }>("/admin/security/events-summary").catch(() => ({ summary: [] })),
  ])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">安全概览</h1>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">安全健康检查</h2>
        <ul className="space-y-2 text-sm">
          {Object.entries(health.checks || {}).map(([key, ok]) => (
            <li key={key}>{key} {ok ? "✅" : "❌"}</li>
          ))}
        </ul>
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">最近24小时安全事件</h2>
        <ul className="space-y-2 text-sm">
          {(events.summary || []).map((item) => (
            <li key={item.label} className="flex justify-between"><span>{item.label}</span><span>{item.count}</span></li>
          ))}
          {(events.summary || []).length === 0 && <li className="text-grey-50">暂无事件</li>}
        </ul>
      </div>
    </div>
  )
}
