"use client"

import { Badge, Button, Input, Label, Text } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

export default function InventoryAlerts({ items }: { items: any[] }) {
  const t = useTranslations("admin")
  const [threshold, setThreshold] = useState(10)
  const [showSettings, setShowSettings] = useState(false)

  const alertItems = useMemo(() => {
    return items
      .map((item) => {
        const stocked = item.current_stock ?? item.stocked_quantity ?? 0
        const reserved = item.reserved_quantity ?? 0
        const available = item.available_quantity ?? stocked - reserved
        const threshold = item.threshold ?? 10
        return { ...item, stocked, reserved, available, threshold }
      })
       .filter((item) => item.available <= (item.threshold ?? threshold))
      .sort((a, b) => a.available - b.available)
  }, [items, threshold])

  const outOfStock = alertItems.filter((i) => i.available <= 0)
  const lowStock = alertItems.filter((i) => i.available > 0)

  const exportCsv = () => {
    const header = "SKU,Product,Stocked,Reserved,Available\n"
    const rows = alertItems.map((item) => `${item.sku},${item.title},${item.stocked},${item.reserved},${item.available}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "inventory-alerts.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("inventoryAlerts")}</h1>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded border bg-white p-4"><Text>Total alerts</Text><Badge color="orange">{alertItems.length}</Badge></div>
        <div className="rounded border bg-white p-4"><Text>{t("outOfStockItems")}</Text><Badge color="red">{outOfStock.length}</Badge></div>
        <div className="rounded border bg-white p-4"><Text>{t("lowStockItems")}</Text><Badge color="orange">{lowStock.length}</Badge></div>
      </div>

      <div className="rounded border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("alertThreshold")}</h2>
          <Button variant="secondary" size="small" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? t("hideSettings") : t("showSettings")}
          </Button>
        </div>
        {showSettings && (
          <div className="mt-3 flex items-center gap-3">
            <Label>{t("alertWhenBelow")}</Label>
            <Input type="number" min={1} max={100} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-24" />
            <Text className="text-sm text-ui-fg-subtle">{t("units")}</Text>
          </div>
        )}
      </div>

      <div className="rounded border bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b"><th className="p-2">{t("sku")}</th><th className="p-2">{t("productName")}</th><th className="p-2">{t("stockedQty")}</th><th className="p-2">{t("reservedQty")}</th><th className="p-2">{t("availableQty")}</th><th className="p-2">阈值</th><th className="p-2">Action</th></tr>
          </thead>
          <tbody>
            {alertItems.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-ui-fg-subtle">{t("noAlerts")}</td></tr> : alertItems.map((item) => (
              <tr key={item.id} className={`border-b ${item.available <= 0 ? "bg-red-50" : "bg-amber-50"}`}>
                <td className="p-2">{item.sku}</td>
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.stocked}</td>
                <td className="p-2">{item.reserved}</td>
                <td className={`p-2 ${item.available <= 0 ? "text-red-600" : "text-amber-600"}`}>{item.available}</td>
                <td className="p-2">{item.threshold ?? threshold}</td>
                <td className="p-2"><Button size="small" onClick={() => {}}>{t("quickRestock")}</Button></td>
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
