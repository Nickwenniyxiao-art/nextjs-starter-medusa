"use client"

import { ReconciliationRecord } from "@lib/data/admin"
import { Badge } from "@medusajs/ui"
import { useTranslations } from "next-intl"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function ReconciliationView({
  records,
}: {
  records: ReconciliationRecord[]
}) {
  const t = useTranslations("admin")

  const discrepancies = records.filter((r) => r.diff !== 0)
  const matched = records.filter((r) => r.diff === 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("reconciliation")}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("totalOrders")}</p>
          <p className="mt-1 text-2xl font-semibold">{records.length}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("matched")}</p>
          <p className="mt-1 text-2xl font-semibold text-green-700">
            {matched.length}
          </p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("discrepancies")}</p>
          <p className="mt-1 text-2xl font-semibold text-red-700">
            {discrepancies.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">{t("orderNumber")}</th>
              <th className="p-2 text-left">{t("orderAmount")}</th>
              <th className="p-2 text-left">{t("capturedAmount")}</th>
              <th className="p-2 text-left">{t("difference")}</th>
              <th className="p-2 text-left">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.order_id}
                className={`border-b ${r.diff !== 0 ? "bg-red-50" : ""}`}
              >
                <td className="p-2">#{r.display_id}</td>
                <td className="p-2">
                  {currencyFormatter.format(r.order_amount)}
                </td>
                <td className="p-2">
                  {currencyFormatter.format(r.captured_amount)}
                </td>
                <td
                  className={`p-2 ${
                    r.diff !== 0 ? "font-semibold text-red-700" : ""
                  }`}
                >
                  {r.diff === 0 ? "—" : currencyFormatter.format(r.diff)}
                </td>
                <td className="p-2">
                  <Badge color={r.diff === 0 ? "green" : "red"}>
                    {r.diff === 0 ? t("matched") : t("mismatch")}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
