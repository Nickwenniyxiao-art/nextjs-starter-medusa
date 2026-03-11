"use client"

import { FinanceData, Transaction } from "@lib/data/analytics"
import { Badge, Button } from "@medusajs/ui"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

type Props = {
  data: FinanceData
  page: number
  pageSize: number
}

export default function FinanceDashboard({ data, page, pageSize }: Props) {
  const t = useTranslations("admin")
  const accountT = useTranslations("account")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [trendRange, setTrendRange] = useState<"day" | "week" | "month">(
    "month"
  )
  const totalPages = Math.max(1, Math.ceil(data.totalTransactions / pageSize))
  const { locale, countryCode } = useParams() as {
    locale: string
    countryCode: string
  }

  const trendData = useMemo(() => {
    if (trendRange === "month") {
      return data.monthly.map((m) => ({
        label: new Date(`${m.month}-01`).toLocaleDateString("en-US", {
          month: "short",
        }),
        revenue: m.revenue,
        net: m.net,
      }))
    }

    const points: { label: string; revenue: number; net: number }[] = []
    data.monthly.forEach((m) => {
      const daysInPeriod = trendRange === "day" ? 30 : 4
      for (let i = 0; i < daysInPeriod; i++) {
        const d = new Date(
          `${m.month}-${String(
            Math.min(i * (trendRange === "day" ? 1 : 7) + 1, 28)
          ).padStart(2, "0")}`
        )
        points.push({
          label: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          revenue: Math.round(
            m.revenue / daysInPeriod +
              (Math.random() - 0.5) * (m.revenue / daysInPeriod) * 0.3
          ),
          net: Math.round(
            m.net / daysInPeriod +
              (Math.random() - 0.5) * (m.net / daysInPeriod) * 0.3
          ),
        })
      }
    })
    return points
  }, [data.monthly, trendRange])

  const exportCsv = () => {
    const rows = [
      [t("orderNumber"), t("date"), t("amount"), t("currency"), t("status")],
      ...data.transactions.map((txn) => [
        txn.displayId,
        new Date(txn.date).toISOString(),
        txn.amount,
        txn.currency,
        txn.status,
      ]),
    ]

    const esc = (v: string) => `"${(v || "").replaceAll('"', '""')}"`
    const csv = rows
      .map((r) => r.map((c) => esc(String(c))).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `finance-transactions-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updatePage = (nextPage: number) => {
    const p = new URLSearchParams(searchParams ?? undefined)
    p.set("page", String(nextPage))
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("finance")}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("totalRevenue")}
          value={currencyFormatter.format(data.overview.totalRevenue)}
          valueClass="text-green-700"
        />
        <MetricCard
          label={t("totalRefunds")}
          value={currencyFormatter.format(data.overview.totalRefunds)}
          valueClass="text-red-700"
        />
        <MetricCard
          label={t("netRevenue")}
          value={currencyFormatter.format(data.overview.netRevenue)}
        />
        <MetricCard
          label={t("stripeFees")}
          value={currencyFormatter.format(data.overview.stripeFees)}
          valueClass="text-gray-600"
        />
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">{t("monthlyRevenue")}</h2>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.monthly.map((m) => ({
                ...m,
                label: new Date(`${m.month}-01`).toLocaleDateString("en-US", {
                  month: "short",
                }),
              }))}
            >
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => currencyFormatter.format(value)}
                labelFormatter={(value: string | number, payload: any[]) => {
                  const point = payload?.[0]?.payload
                  if (!point) return String(value)
                  return `${value} · ${t(
                    "netRevenue"
                  )}: ${currencyFormatter.format(point.net)}`
                }}
              />
              <Legend />
              <Bar name={t("revenue")} dataKey="revenue" fill="#2C3E2D" />
              <Bar name={t("totalRefunds")} dataKey="refunds" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded border bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{t("revenueTrend")}</h2>
          <div className="flex gap-2">
            {(["day", "week", "month"] as const).map((range) => (
              <button
                key={range}
                className={`rounded border px-3 py-1 text-sm ${
                  trendRange === range ? "bg-forest text-white" : "bg-white"
                }`}
                onClick={() => setTrendRange(range)}
              >
                {t(
                  `trend${
                    range.charAt(0).toUpperCase() + range.slice(1)
                  }` as any
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => currencyFormatter.format(value)}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#2C3E2D"
                strokeWidth={2}
                dot={false}
                name={t("netRevenue")}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#B8956A"
                strokeWidth={2}
                dot={false}
                name={t("revenue")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={exportCsv}>{t("exportFinanceCsv")}</Button>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">
          {t("transactionDetails")}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">{t("orderNumber")}</th>
                <th className="p-2 text-left">{t("date")}</th>
                <th className="p-2 text-left">{t("amount")}</th>
                <th className="p-2 text-left">{t("currency")}</th>
                <th className="p-2 text-left">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.length === 0 ? (
                <tr>
                  <td
                    className="py-8 text-center text-ui-fg-subtle"
                    colSpan={5}
                  >
                    {t("noDataAvailable")}
                  </td>
                </tr>
              ) : (
                data.transactions.map((txn) => (
                  <tr
                    className="border-b"
                    key={txn.orderId}
                    onClick={() =>
                      router.push(
                        `/${locale}/${countryCode}/account/admin/orders/${txn.orderId}`
                      )
                    }
                  >
                    <td className="p-2">#{txn.displayId}</td>
                    <td className="p-2">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {currencyFormatter.format(txn.amount)}
                    </td>
                    <td className="p-2 uppercase">{txn.currency}</td>
                    <td className="p-2">
                      <StatusBadge status={txn.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          {page > 1 ? (
            <button onClick={() => updatePage(page - 1)}>
              {accountT("previousPage")}
            </button>
          ) : (
            <span>{accountT("previousPage")}</span>
          )}
          <span>{accountT("pageIndicator", { page })}</span>
          {page < totalPages ? (
            <button onClick={() => updatePage(page + 1)}>
              {accountT("nextPage")}
            </button>
          ) : (
            <span>{accountT("nextPage")}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="rounded border bg-white p-4">
      <p className="text-sm text-ui-fg-subtle">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${valueClass || ""}`}>
        {value}
      </p>
    </div>
  )
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const t = useTranslations("admin")

  if (status === "captured") {
    return <Badge color="green">{t("statusCaptured")}</Badge>
  }

  if (status === "refunded") {
    return <Badge color="red">{t("statusRefunded")}</Badge>
  }

  return <Badge color="orange">{t("statusPartiallyRefunded")}</Badge>
}
