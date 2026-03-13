import { getAdminDashboardStats, getRevenueTrend, adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import Link from "next/link"
import { redirect } from "next/navigation"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  let error: string | null = null
  let stats = {
    ordersToday: 0,
    revenueToday: 0,
    lowStockCount: 0,
    activeUsers: 0,
    openTickets: 0,
  }
  let trend: { date: string; amount: number }[] = []
  let recentOrders: any[] = []

  try {
    ;[stats, trend] = await Promise.all([
      getAdminDashboardStats(),
      getRevenueTrend("daily"),
    ])

    const orders = await adminFetch<{ orders?: any[] }>("/admin/orders", {
      query: { limit: 10, order: "-created_at" },
    })

    recentOrders = orders.orders || []
  } catch (e: any) {
    error = e?.message || "加载仪表盘数据失败"
  }

  const kpiCards = [
    { label: "今日订单数", value: String(stats.ordersToday) },
    { label: "今日收入", value: formatCurrency(stats.revenueToday) },
    { label: "低库存商品数", value: String(stats.lowStockCount) },
    { label: "活跃用户数", value: String(stats.activeUsers) },
  ]

  const maxAmount = Math.max(...trend.map((point) => point.amount), 1)

  return (
    <div className="space-y-6" data-testid="admin-overview-page">
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
            <p className="text-sm text-grey-50">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-forest">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-grey-80">收入趋势（Daily）</h3>
        {trend.length === 0 ? (
          <p className="text-sm text-grey-50">暂无收入趋势数据</p>
        ) : (
          <div className="flex h-48 items-end gap-2 overflow-x-auto">
            {trend.slice(-14).map((point) => {
              const height = Math.max((point.amount / maxAmount) * 100, 8)
              return (
                <div key={point.date} className="min-w-10 text-center text-xs text-grey-50">
                  <div className="mx-auto w-6 rounded-t bg-[#2C3E2D]" style={{ height: `${height}%` }} />
                  <p className="mt-1">{point.date.slice(5)}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-grey-80">最近订单</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-20 text-grey-50">
                <th className="py-2">订单号</th>
                <th className="py-2">客户名</th>
                <th className="py-2">金额</th>
                <th className="py-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-grey-10">
                  <td className="py-3">
                    <Link className="text-forest hover:underline" href={`/${countryCode}/account/admin/orders/${order.id}`}>
                      #{order.display_id || order.id}
                    </Link>
                  </td>
                  <td className="py-3 text-grey-70">{order.email || "-"}</td>
                  <td className="py-3 text-grey-70">{formatCurrency((order.summary?.current_order_total ?? order.total) || 0)}</td>
                  <td className="py-3 text-grey-70">{order.fulfillment_status || order.status || "-"}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-grey-50" colSpan={4}>暂无订单数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-grey-80">待处理工单</h3>
        <p className="text-grey-60">当前待处理工单：{stats.openTickets}</p>
      </section>
    </div>
  )
}
