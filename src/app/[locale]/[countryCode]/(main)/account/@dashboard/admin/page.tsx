import { isAdmin } from "@lib/util/admin-guard"
import Link from "next/link"
import { redirect } from "next/navigation"

const kpiCards = [
  {
    label: "今日订单数",
    value: "128",
    change: "+12.6%",
    trend: "↑",
    trendUp: true,
    // TODO: Replace with GET /admin/analytics/orders-today
  },
  {
    label: "今日收入",
    value: "¥86,420",
    change: "+8.3%",
    trend: "↑",
    trendUp: true,
    // TODO: Replace with GET /admin/analytics/revenue-today
  },
  {
    label: "在线访客数",
    value: "342",
    change: "-3.1%",
    trend: "↓",
    trendUp: false,
    // TODO: Replace mock data with realtime visitor service
  },
  {
    label: "待处理工单数",
    value: "17",
    change: "+5.9%",
    trend: "↑",
    trendUp: true,
    // TODO: Replace with GET /admin/after-sales/tickets?status=open
  },
]

const recentOrders = [
  { id: "100901", customer: "Lina Wang", amount: "¥1,299", status: "待发货", time: "10:32" },
  { id: "100900", customer: "Mia Chen", amount: "¥899", status: "已付款", time: "10:20" },
  { id: "100899", customer: "Kevin Yu", amount: "¥2,399", status: "已发货", time: "10:14" },
  { id: "100898", customer: "Alex Wu", amount: "¥429", status: "退款中", time: "09:58" },
  { id: "100897", customer: "Ivy Li", amount: "¥3,120", status: "待发货", time: "09:31" },
  { id: "100896", customer: "Sophie Yan", amount: "¥749", status: "已完成", time: "09:05" },
  { id: "100895", customer: "Noah Gu", amount: "¥1,050", status: "已付款", time: "08:47" },
  { id: "100894", customer: "Emma Hao", amount: "¥1,589", status: "已发货", time: "08:22" },
  { id: "100893", customer: "Chris Zhao", amount: "¥629", status: "待发货", time: "08:09" },
  { id: "100892", customer: "Olivia Xu", amount: "¥2,060", status: "已完成", time: "07:43" },
  // TODO: Replace with GET /admin/orders?limit=10
]

const openTickets = [
  { id: "AS-2201", customer: "Lina Wang", type: "退货", priority: "高" },
  { id: "AS-2200", customer: "Mia Chen", type: "维修", priority: "中" },
  { id: "AS-2198", customer: "Kevin Yu", type: "咨询", priority: "低" },
  { id: "AS-2197", customer: "Ivy Li", type: "退货", priority: "高" },
  { id: "AS-2196", customer: "Alex Wu", type: "维修", priority: "中" },
  // TODO: Replace with GET /admin/after-sales/tickets?status=open&limit=5
]

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
            <p className="text-sm text-grey-50">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-forest">{card.value}</p>
            <p className={card.trendUp ? "mt-2 text-sm text-emerald-700" : "mt-2 text-sm text-rose-700"}>
              {card.trend} {card.change}
            </p>
          </article>
        ))}
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
                <th className="py-2">时间</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-grey-10">
                  <td className="py-3">
                    <Link className="text-forest hover:underline" href={`/${countryCode}/account/admin/oms/orders/${order.id}`}>
                      #{order.id}
                    </Link>
                  </td>
                  <td className="py-3 text-grey-70">{order.customer}</td>
                  <td className="py-3 text-grey-70">{order.amount}</td>
                  <td className="py-3 text-grey-70">{order.status}</td>
                  <td className="py-3 text-grey-50">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-grey-80">待处理工单</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {openTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/${countryCode}/account/admin/after-sales`}
              className="rounded-xl border border-grey-20 bg-warm px-4 py-3 transition hover:border-forest"
            >
              <p className="text-sm font-medium text-grey-80">{ticket.id}</p>
              <p className="mt-1 text-sm text-grey-60">{ticket.customer}</p>
              <p className="mt-1 text-sm text-grey-50">
                {ticket.type} · 紧急程度 {ticket.priority}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
