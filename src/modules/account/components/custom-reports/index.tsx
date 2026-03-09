"use client"

import { Button, Input, Text } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

type GroupBy = "day" | "week" | "month"

const COLORS = ["#2C3E2D", "#3A5240", "#4A6A50", "#5A8060", "#6B9670", "#B8956A", "#C4A77D", "#D0B990"]

function generateReportData(days: number, groupBy: GroupBy) {
  const raw = Array.from({ length: days }, (_, idx) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - idx - 1))
    const revenue = Math.round(800 + Math.random() * 4200)
    const orders = Math.max(1, Math.round(revenue / (100 + Math.random() * 300)))
    const refunds = Math.round(revenue * (Math.random() * 0.08))

    return {
      date: d,
      label: d.toISOString().split("T")[0],
      revenue,
      orders,
      aov: Math.round(revenue / orders),
      refunds,
    }
  })

  if (groupBy === "day") {
    return raw
  }

  const grouped = new Map<string, (typeof raw)[number][]>()

  raw.forEach((point) => {
    const key =
      groupBy === "week"
        ? `${point.date.getFullYear()}-W${Math.ceil(point.date.getDate() / 7)}`
        : `${point.date.getFullYear()}-${String(point.date.getMonth() + 1).padStart(2, "0")}`

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }

    grouped.get(key)?.push(point)
  })

  return Array.from(grouped.entries()).map(([label, values]) => {
    const revenue = values.reduce((acc, point) => acc + point.revenue, 0)
    const orders = values.reduce((acc, point) => acc + point.orders, 0)
    const refunds = values.reduce((acc, point) => acc + point.refunds, 0)

    return {
      label,
      revenue,
      orders,
      aov: Math.round(revenue / Math.max(orders, 1)),
      refunds,
    }
  })
}

export default function CustomReports() {
  const t = useTranslations("admin")
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line")
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">("30d")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [dimension, setDimension] = useState<"revenue" | "orders" | "aov" | "refunds">("revenue")
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day")

  const reportData = useMemo(() => {
    let days = dateRange === "7d" ? 7 : dateRange === "90d" ? 90 : 30

    if (dateRange === "custom" && customFrom && customTo) {
      const from = new Date(customFrom)
      const to = new Date(customTo)
      const diff = Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1
      days = Math.max(1, Math.min(diff, 365))
    }

    return generateReportData(days, groupBy)
  }, [dateRange, customFrom, customTo, groupBy])

  const exportCsv = () => {
    const header = "Period,Revenue,Orders,AOV,Refunds\n"
    const rows = reportData
      .map((item) => `${item.label},${item.revenue},${item.orders},${item.aov},${item.refunds}`)
      .join("\n")

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `custom-report-${dimension}-${dateRange}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t("customReports")}</h1>
      </div>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">{t("mockDataNotice")}</p>

      <div className="flex flex-wrap gap-4 rounded border bg-white p-4">
        <div className="space-y-2">
          <Text className="text-sm font-medium">{t("dimension")}</Text>
          <div className="flex flex-wrap gap-2">
            {(["revenue", "orders", "aov", "refunds"] as const).map((key) => (
              <button key={key} className={`rounded border px-3 py-1 text-sm ${dimension === key ? "bg-forest text-white" : "bg-white"}`} onClick={() => setDimension(key)}>
                {t(`dimension${key.charAt(0).toUpperCase() + key.slice(1)}` as "dimensionRevenue")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Text className="text-sm font-medium">{t("chartType")}</Text>
          <div className="flex flex-wrap gap-2">
            {[{ key: "line", icon: "📈", label: t("lineChart") }, { key: "bar", icon: "📊", label: t("barChart") }, { key: "pie", icon: "🥧", label: t("pieChart") }].map((item) => (
              <button key={item.key} className={`rounded border px-3 py-1 text-sm ${chartType === item.key ? "bg-forest text-white" : "bg-white"}`} onClick={() => setChartType(item.key as "line" | "bar" | "pie")}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Text className="text-sm font-medium">{t("groupBy")}</Text>
          <div className="flex flex-wrap gap-2">
            {(["day", "week", "month"] as const).map((key) => (
              <button key={key} className={`rounded border px-3 py-1 text-sm ${groupBy === key ? "bg-forest text-white" : "bg-white"}`} onClick={() => setGroupBy(key)}>
                {t(`groupBy${key.charAt(0).toUpperCase() + key.slice(1)}` as "groupByDay")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Text className="text-sm font-medium">{t("dateRange")}</Text>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: "7d", label: t("dateRange7d") },
              { key: "30d", label: t("dateRange30d") },
              { key: "90d", label: t("dateRange90d") },
              { key: "custom", label: t("dateRangeCustom") },
            ] as const).map((item) => (
              <button key={item.key} className={`rounded border px-3 py-1 text-sm ${dateRange === item.key ? "bg-forest text-white" : "bg-white"}`} onClick={() => setDateRange(item.key)}>
                {item.label}
              </button>
            ))}
            {dateRange === "custom" && (
              <>
                <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} aria-label={t("fromDate")} />
                <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} aria-label={t("toDate")} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-[400px] rounded border bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey={dimension} stroke="#2C3E2D" strokeWidth={2} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dimension} fill="#2C3E2D" />
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={reportData} dataKey={dimension} nameKey="label" label>
                {reportData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="rounded border bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">{t("period")}</th>
              <th className={`p-2 ${dimension === "revenue" ? "font-semibold" : ""}`}>{t("dimensionRevenue")}</th>
              <th className={`p-2 ${dimension === "orders" ? "font-semibold" : ""}`}>{t("dimensionOrders")}</th>
              <th className={`p-2 ${dimension === "aov" ? "font-semibold" : ""}`}>{t("dimensionAov")}</th>
              <th className={`p-2 ${dimension === "refunds" ? "font-semibold" : ""}`}>{t("dimensionRefunds")}</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr key={row.label} className="border-b">
                <td className="p-2">{row.label}</td>
                <td className={`p-2 ${dimension === "revenue" ? "font-semibold" : ""}`}>{row.revenue}</td>
                <td className={`p-2 ${dimension === "orders" ? "font-semibold" : ""}`}>{row.orders}</td>
                <td className={`p-2 ${dimension === "aov" ? "font-semibold" : ""}`}>{row.aov}</td>
                <td className={`p-2 ${dimension === "refunds" ? "font-semibold" : ""}`}>{row.refunds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button onClick={exportCsv}>{t("exportCsv")}</Button>
      </div>
    </div>
  )
}
