"use client"

import { Badge, Button, Input } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface TaxRegion {
  id: string
  region: string
  country: string
  rate: number
  taxInclusive: boolean
}

const MOCK_TAX_REGIONS: TaxRegion[] = [
  {
    id: "tax_1",
    region: "US",
    country: "United States",
    rate: 0,
    taxInclusive: false,
  },
  {
    id: "tax_2",
    region: "CA",
    country: "Canada",
    rate: 5,
    taxInclusive: false,
  },
  {
    id: "tax_3",
    region: "GB",
    country: "United Kingdom",
    rate: 20,
    taxInclusive: true,
  },
  {
    id: "tax_4",
    region: "DE",
    country: "Germany",
    rate: 19,
    taxInclusive: true,
  },
  {
    id: "tax_5",
    region: "NO",
    country: "Norway",
    rate: 25,
    taxInclusive: true,
  },
  {
    id: "tax_6",
    region: "DK",
    country: "Denmark",
    rate: 25,
    taxInclusive: true,
  },
  {
    id: "tax_7",
    region: "FR",
    country: "France",
    rate: 20,
    taxInclusive: true,
  },
  {
    id: "tax_8",
    region: "AU",
    country: "Australia",
    rate: 10,
    taxInclusive: true,
  },
]

export default function TaxConfig() {
  const t = useTranslations("admin")
  const [regions, setRegions] = useState<TaxRegion[]>(MOCK_TAX_REGIONS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRate, setEditRate] = useState(0)

  const startEdit = (region: TaxRegion) => {
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
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

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
                  <Badge color={r.taxInclusive ? "green" : "grey"}>
                    {r.taxInclusive ? t("yes") : t("no")}
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
