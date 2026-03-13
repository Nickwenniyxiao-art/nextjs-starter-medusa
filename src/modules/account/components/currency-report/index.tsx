"use client"

import { CurrencyRecord } from "@lib/data/admin"
import { Badge } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

export default function CurrencyReport({
  currencies: allCurrencies,
}: {
  currencies: CurrencyRecord[]
}) {
  const t = useTranslations("admin")
  const [selected, setSelected] = useState("all")

  const currencies =
    selected === "all"
      ? allCurrencies
      : allCurrencies.filter((c) => c.code === selected)

  const fmt = (amount: number, code: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(amount)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("currencyReport")}</h1>

      <div className="flex gap-2 flex-wrap">
        <button
          className={`rounded border px-3 py-1 text-sm ${
            selected === "all" ? "bg-forest text-white" : "bg-white"
          }`}
          onClick={() => setSelected("all")}
        >
          {t("allCurrencies")}
        </button>
        {allCurrencies.map((c) => (
          <button
            key={c.code}
            className={`rounded border px-3 py-1 text-sm ${
              selected === c.code ? "bg-forest text-white" : "bg-white"
            }`}
            onClick={() => setSelected(c.code)}
          >
            {c.code}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">{t("currency")}</th>
              <th className="p-2 text-left">{t("totalRevenue")}</th>
              <th className="p-2 text-left">{t("totalRefunds")}</th>
              <th className="p-2 text-left">{t("netRevenue")}</th>
              <th className="p-2 text-left">{t("todayOrders")}</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((c) => (
              <tr key={c.code} className="border-b">
                <td className="p-2">
                  <Badge>{c.code}</Badge>
                </td>
                <td className="p-2 text-green-700">{fmt(c.revenue, c.code)}</td>
                <td className="p-2 text-red-700">{fmt(c.refunds, c.code)}</td>
                <td className="p-2 font-semibold">{fmt(c.net, c.code)}</td>
                <td className="p-2">{c.orders}</td>
              </tr>
            ))}
          </tbody>
          {selected === "all" && allCurrencies.length > 0 && (
            <tfoot>
              <tr className="border-t font-semibold">
                <td className="p-2">{t("total")}</td>
                <td className="p-2 text-green-700">
                  {fmt(
                    allCurrencies.reduce((s, c) => s + c.revenue, 0),
                    "USD"
                  )}
                </td>
                <td className="p-2 text-red-700">
                  {fmt(
                    allCurrencies.reduce((s, c) => s + c.refunds, 0),
                    "USD"
                  )}
                </td>
                <td className="p-2">
                  {fmt(
                    allCurrencies.reduce((s, c) => s + c.net, 0),
                    "USD"
                  )}
                </td>
                <td className="p-2">
                  {allCurrencies.reduce((s, c) => s + c.orders, 0)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
