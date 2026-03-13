"use client"

import { Badge } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

const MOCK_CURRENCIES = [
  { code: "USD", revenue: 78200, refunds: 2100, net: 76100, orders: 142 },
  { code: "EUR", revenue: 21400, refunds: 650, net: 20750, orders: 38 },
  { code: "GBP", revenue: 8900, refunds: 350, net: 8550, orders: 15 },
  { code: "NOK", revenue: 3980, refunds: 150, net: 3830, orders: 8 },
]

export default function CurrencyReport() {
  const t = useTranslations("admin")
  const [selected, setSelected] = useState("all")

  const currencies =
    selected === "all"
      ? MOCK_CURRENCIES
      : MOCK_CURRENCIES.filter((c) => c.code === selected)

  const fmt = (amount: number, code: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(amount)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("currencyReport")}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

      <div className="flex gap-2 flex-wrap">
        <button
          className={`rounded border px-3 py-1 text-sm ${
            selected === "all" ? "bg-forest text-white" : "bg-white"
          }`}
          onClick={() => setSelected("all")}
        >
          {t("allCurrencies")}
        </button>
        {MOCK_CURRENCIES.map((c) => (
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
          {selected === "all" && (
            <tfoot>
              <tr className="border-t font-semibold">
                <td className="p-2">{t("total")}</td>
                <td className="p-2 text-green-700">
                  {fmt(
                    MOCK_CURRENCIES.reduce((s, c) => s + c.revenue, 0),
                    "USD"
                  )}
                </td>
                <td className="p-2 text-red-700">
                  {fmt(
                    MOCK_CURRENCIES.reduce((s, c) => s + c.refunds, 0),
                    "USD"
                  )}
                </td>
                <td className="p-2">
                  {fmt(
                    MOCK_CURRENCIES.reduce((s, c) => s + c.net, 0),
                    "USD"
                  )}
                </td>
                <td className="p-2">
                  {MOCK_CURRENCIES.reduce((s, c) => s + c.orders, 0)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
