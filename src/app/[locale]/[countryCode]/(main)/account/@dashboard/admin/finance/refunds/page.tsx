import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"

export default async function RefundSummaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { countryCode } = await params
  const sp = await searchParams

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const from = sp.from || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
  const to = sp.to || new Date().toISOString().slice(0, 10)

  const data = await adminFetch<{ summary?: any; reasons?: { reason: string; amount: number; count: number }[] }>(
    "/admin/finance/refund-summary",
    { query: { from, to } }
  ).catch(() => ({ summary: { total_amount: 0, total_count: 0, average_amount: 0 }, reasons: [] }))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">退款报告</h1>
      <form className="flex gap-2 rounded border bg-white p-4">
        <input type="date" name="from" defaultValue={from} className="rounded border p-2" />
        <input type="date" name="to" defaultValue={to} className="rounded border p-2" />
        <button className="rounded bg-[#2C3E2D] px-4 py-2 text-white" type="submit">筛选</button>
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded border bg-white p-4">总退款金额：{data.summary?.total_amount || 0}</div>
        <div className="rounded border bg-white p-4">退款次数：{data.summary?.total_count || 0}</div>
        <div className="rounded border bg-white p-4">平均退款额：{data.summary?.average_amount || 0}</div>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">按原因汇总</h2>
        <ul className="space-y-2">
          {(data.reasons || []).map((item) => (
            <li key={item.reason} className="flex items-center justify-between rounded bg-warm px-3 py-2 text-sm">
              <span>{item.reason}</span>
              <span>{item.count} 次 · {item.amount}</span>
            </li>
          ))}
          {(data.reasons || []).length === 0 && <li className="text-sm text-grey-50">暂无数据</li>}
        </ul>
      </div>
    </div>
  )
}
