"use client"

import { FunnelStage } from "@lib/data/analytics"
import { Badge, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

export default function FunnelVisualization({ funnel }: { funnel: FunnelStage[] }) {
  const t = useTranslations("admin")
  const [days, setDays] = useState<7 | 30 | 90>(30)

  const funnelLabels: Record<string, string> = {
    browse: t("funnelBrowse"),
    addToCart: t("funnelAddToCart"),
    checkout: t("funnelCheckout"),
    purchase: t("funnelPurchase"),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("funnelAnalysis")}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">{t("mockDataNotice")}</p>

      <div className="flex gap-2">
        {[7, 30, 90].map((range) => (
          <button key={range} className={`rounded border px-3 py-1 text-sm ${days === range ? "bg-forest text-white" : "bg-white"}`} onClick={() => setDays(range as 7 | 30 | 90)}>
            {range}d
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("totalVisitors")}</p>
          <p className="text-2xl font-semibold">{funnel[0]?.count.toLocaleString() || 0}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("funnelAddToCart")}</p>
          <p className="text-2xl font-semibold">{funnel[1]?.rate || 0}%</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("funnelCheckout")}</p>
          <p className="text-2xl font-semibold">{funnel[2]?.rate || 0}%</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("funnelPurchase")}</p>
          <p className="text-2xl font-semibold">{funnel[3]?.rate || 0}%</p>
        </div>
      </div>

      <div className="rounded border bg-white p-4">
        {funnel.map((stage, idx) => {
          const widthPercent = Math.max((stage.count / funnel[0].count) * 100, 15)
          const colors = ["#2C3E2D", "#3A5240", "#4A6A50", "#5A8060"]
          return (
            <div key={stage.stage} className="mb-3 flex items-center gap-4">
              <div className="w-32 text-right text-sm font-medium">{funnelLabels[stage.stage] || stage.stage}</div>
              <div className="flex-1">
                <div className="flex h-12 items-center justify-between rounded px-4 text-sm font-medium text-white" style={{ width: `${widthPercent}%`, backgroundColor: colors[idx] || colors[3] }}>
                  <span>{stage.count.toLocaleString()}</span>
                  <span>{stage.rate}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-3 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">{t("funnelDropOff")}</h2>
        {funnel.slice(1).map((stage, idx) => {
          const prev = funnel[idx]
          const dropOff = prev.count - stage.count
          const dropRate = ((dropOff / prev.count) * 100).toFixed(1)
          return (
            <div key={stage.stage} className="flex items-center justify-between rounded border p-3">
              <Text>{funnelLabels[prev.stage]} → {funnelLabels[stage.stage]}</Text>
              <div className="flex items-center gap-3">
                <Badge color="red">-{dropOff.toLocaleString()} ({dropRate}%)</Badge>
              </div>
            </div>
          )
        })}
      </div>
      {/* TODO: re-fetch funnel data when time range changes */}
    </div>
  )
}
