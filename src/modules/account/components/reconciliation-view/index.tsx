"use client"

import { Badge } from "@medusajs/ui"
import { useTranslations } from "next-intl"

const MOCK_RECONCILIATION = [
  {
    orderId: "order_001",
    displayId: 1,
    orderAmount: 1249,
    capturedAmount: 1249,
    diff: 0,
  },
  {
    orderId: "order_002",
    displayId: 2,
    orderAmount: 899,
    capturedAmount: 899,
    diff: 0,
  },
  {
    orderId: "order_003",
    displayId: 3,
    orderAmount: 2150,
    capturedAmount: 2085,
    diff: -65,
  },
  {
    orderId: "order_004",
    displayId: 4,
    orderAmount: 549,
    capturedAmount: 549,
    diff: 0,
  },
  {
    orderId: "order_005",
    displayId: 5,
    orderAmount: 1875,
    capturedAmount: 1819,
    diff: -56,
  },
  {
    orderId: "order_006",
    displayId: 6,
    orderAmount: 430,
    capturedAmount: 430,
    diff: 0,
  },
  {
    orderId: "order_007",
    displayId: 7,
    orderAmount: 3200,
    capturedAmount: 3200,
    diff: 0,
  },
  {
    orderId: "order_008",
    displayId: 8,
    orderAmount: 765,
    capturedAmount: 742,
    diff: -23,
  },
]

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function ReconciliationView() {
  const t = useTranslations("admin")

  const discrepancies = MOCK_RECONCILIATION.filter((r) => r.diff !== 0)
  const matched = MOCK_RECONCILIATION.filter((r) => r.diff === 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("reconciliation")}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {t("mockDataNotice")}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-ui-fg-subtle">{t("totalOrders")}</p>
          <p className="mt-1 text-2xl font-semibold">
            {MOCK_RECONCILIATION.length}
          </p>
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
            {MOCK_RECONCILIATION.map((r) => (
              <tr
                key={r.orderId}
                className={`border-b ${r.diff !== 0 ? "bg-red-50" : ""}`}
              >
                <td className="p-2">#{r.displayId}</td>
                <td className="p-2">
                  {currencyFormatter.format(r.orderAmount)}
                </td>
                <td className="p-2">
                  {currencyFormatter.format(r.capturedAmount)}
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
