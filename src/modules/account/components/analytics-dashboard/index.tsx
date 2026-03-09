"use client"

import { AnalyticsData, FunnelStage } from "@lib/data/analytics"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Button, Text } from "@medusajs/ui"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const t = useTranslations("admin")
  const [days, setDays] = useState<7 | 30 | 90>(30)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setLastRefresh(new Date())
      // In mock mode, this just updates the timestamp
      // TODO: re-fetch data from server when live API is connected
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const trendData = useMemo(() => data.salesTrend.slice(-days), [data.salesTrend, days])

  const maxFunnel = Math.max(...data.funnel.map((f) => f.count), 1)

  const funnelLabels: Record<string, string> = {
    browse: t("funnelBrowse"),
    addToCart: t("funnelAddToCart"),
    checkout: t("funnelCheckout"),
    purchase: t("funnelPurchase"),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("analytics")}</h1>
      <div className="flex items-center gap-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          {t("autoRefresh")}
        </label>
        <Text className="text-ui-fg-subtle">
          {t("lastUpdated")}: {lastRefresh.toLocaleTimeString()}
        </Text>
      </div>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">{t("mockDataNotice")}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={t("todaySales")} value={currencyFormatter.format(data.kpi.todaySales)} trend={data.kpi.trends.sales} />
        <KpiCard label={t("todayOrders")} value={String(data.kpi.todayOrders)} trend={data.kpi.trends.orders} />
        <KpiCard label={t("averageOrderValue")} value={currencyFormatter.format(data.kpi.averageOrderValue)} trend={data.kpi.trends.aov} />
        <KpiCard label={t("refundRate")} value={`${data.kpi.refundRate}%`} trend={data.kpi.trends.refunds} />
      </div>

      <div className="rounded border bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{t("salesTrend")}</h2>
          <div className="flex gap-2">
            {[7, 30, 90].map((range) => (
              <button
                key={range}
                className={`rounded border px-3 py-1 text-sm ${days === range ? "bg-forest text-white" : "bg-white"}`}
                onClick={() => setDays(range as 7 | 30 | 90)}
              >
                {t(`days${range}` as "days7")}
              </button>
            ))}
          </div>
        </div>
        {trendData.length === 0 ? (
          <p className="py-8 text-center text-ui-fg-subtle">{t("noDataAvailable")}</p>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                <Line type="monotone" dataKey="amount" stroke="#2C3E2D" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">{t("topProducts")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">{t("rank")}</th>
                <th className="p-2">{t("productName")}</th>
                <th className="p-2">{t("unitsSold")}</th>
                <th className="p-2">{t("revenue")}</th>
                <th className="p-2">{t("share")}</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ui-fg-subtle">{t("noSalesData")}</td>
                </tr>
              ) : (
                data.topProducts.slice(0, 10).map((product, idx) => (
                  <tr key={product.name} className="border-b">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.unitsSold}</td>
                    <td className="p-2">{currencyFormatter.format(product.revenue)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span>{product.share}%</span>
                        <div className="h-2 w-20 rounded bg-gray-100">
                          <div className="h-2 rounded bg-forest" style={{ width: `${Math.max(product.share, 2)}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">{t("conversionFunnel")}</h2>
        <div className="space-y-3">
          {data.funnel.map((stage, idx) => (
            <FunnelBar key={stage.stage} stage={stage} maxFunnel={maxFunnel} label={funnelLabels[stage.stage] || stage.stage} idx={idx} />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={() => {
            const header = "Date,Amount,Orders\n"
            const rows = data.salesTrend
              .slice(-days)
              .map((d) => `${d.date},${d.amount},${d.orders}`)
              .join("\n")
            const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
            const a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = `analytics_${days}d.csv`
            a.click()
          }}
        >
          {t("exportCsv")}
        </Button>
      </div>
    </div>
  )
}

function KpiCard({ label, value, trend }: { label: string; value: string; trend: number }) {
  const t = useTranslations("admin")

  return (
    <div className="rounded border bg-white p-4">
      <p className="text-sm text-ui-fg-subtle">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className={`mt-1 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% {t("vsYesterday")}
      </p>
    </div>
  )
}

function FunnelBar({ stage, maxFunnel, label, idx }: { stage: FunnelStage; maxFunnel: number; label: string; idx: number }) {
  const colors = ["#2C3E2D", "#3A5240", "#4A6A50", "#5A8060"]
  const widthPercent = Math.max((stage.count / maxFunnel) * 100, 8)

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{stage.count} · {stage.rate}%</span>
      </div>
      <div className="h-8 rounded text-white" style={{ width: `${widthPercent}%`, backgroundColor: colors[idx] || colors[3] }} />
    </div>
  )
}
