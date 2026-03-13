"use client"

import { TaxRegionRecord } from "@lib/data/admin"
import { Badge, Button, Input } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

export default function TaxConfig({
  initialRegions,
}: {
  initialRegions: TaxRegionRecord[]
}) {
  const t = useTranslations("admin")
  const [regions, setRegions] = useState<TaxRegionRecord[]>(initialRegions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRate, setEditRate] = useState(0)

  const startEdit = (region: TaxRegionRecord) => {
    setEditingId(region.id)
    setEditRate(region.rate)
  }

  const saveEdit = (id: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rate: editRate } : r))
    )
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("taxConfig")}</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">{t("taxRegion")}</th>
              <th className="p-2 text-left">{t("taxCountry")}</th>
              <th className="p-2 text-left">{t("taxRate")}</th>
              <th className="p-2 text-left">{t("taxInclusive")}</th>
              <th className="p-2 text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">
                  <Badge>{r.region}</Badge>
                </td>
                <td className="p-2">{r.country}</td>
                <td className="p-2">
                  {editingId === r.id ? (
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      className="w-20"
                    />
                  ) : (
                    `${r.rate}%`
                  )}
                </td>
                <td className="p-2">
                  <Badge color={r.tax_inclusive ? "green" : "grey"}>
                    {r.tax_inclusive ? t("yes") : t("no")}
                  </Badge>
                </td>
                <td className="p-2">
                  {editingId === r.id ? (
                    <div className="flex gap-1">
                      <Button size="small" onClick={() => saveEdit(r.id)}>
                        {t("save")}
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        {t("cancelAction")}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => startEdit(r)}
                    >
                      {t("edit")}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
