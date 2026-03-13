import { fetchOrderStats, fetchOrders, fetchTickets } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const t = await getTranslations("admin")

  const [stats, ordersData, ticketsData] = await Promise.all([
    fetchOrderStats(),
    fetchOrders({ limit: 10 }),
    fetchTickets({ status: "open", limit: 5 }),
  ])

  const kpiCards = [
    {
      label: t("todayOrders"),
      value: String(stats.todayOrders),
      pending: stats.pendingFulfillment,
    },
    {
      label: t("todayRevenue"),
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.todayRevenue / 100),
    },
    {
      label: t("totalOrders"),
      value: String(stats.totalOrders),
    },
    {
      label: t("pendingFulfillment"),
      value: String(stats.pendingFulfillment),
    },
  ]

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
            <p className="text-sm text-grey-50">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-forest">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-grey-80">{t("recentOrders")}</h3>
          <Link href={`/${countryCode}/account/admin/orders`} className="text-sm text-forest hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-20 text-grey-50">
                <th className="py-2">{t("orderNumber")}</th>
                <th className="py-2">{t("customerEmail")}</th>
                <th className="py-2">{t("amount")}</th>
                <th className="py-2">{t("status")}</th>
                <th className="py-2">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ui-fg-subtle">{t("noOrdersFound")}</td>
                </tr>
              ) : (
                ordersData.orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-grey-10">
                    <td className="py-3">
                      <Link className="text-forest hover:underline" href={`/${countryCode}/account/admin/orders/${order.id}`}>
                        #{order.display_id}
                      </Link>
                    </td>
                    <td className="py-3 text-grey-70">{order.email || "—"}</td>
                    <td className="py-3 text-grey-70">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency_code || "usd" }).format((order.total || 0) / 100)}
                    </td>
                    <td className="py-3 text-grey-70">{order.fulfillment_status || order.status || "—"}</td>
                    <td className="py-3 text-grey-50">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-grey-80">{t("openTickets")}</h3>
          <Link href={`/${countryCode}/account/admin/tickets`} className="text-sm text-forest hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        {ticketsData.tickets.length === 0 ? (
          <p className="py-4 text-center text-sm text-ui-fg-subtle">{t("noTicketsFound")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ticketsData.tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/${countryCode}/account/admin/tickets/${ticket.id}`}
                className="rounded-xl border border-grey-20 bg-warm px-4 py-3 transition hover:border-forest"
              >
                <p className="text-sm font-medium text-grey-80">#{ticket.display_id} · {ticket.subject}</p>
                <p className="mt-1 text-sm text-grey-60">{ticket.customer_name}</p>
                <p className="mt-1 text-sm text-grey-50">{ticket.type}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
