"use client"
import { Badge, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

type RecordType = "return" | "exchange" | "claim"

type AfterSalesRecord = {
  id: string
  type: RecordType
  orderId: string
  orderDisplayId: number
  createdAt: string
  status: string
  itemsCount: number
  refundAmount?: number | null
}

const AfterSalesHistory = ({
  records,
  currencyCode,
}: {
  records: AfterSalesRecord[]
  currencyCode: string
}) => {
  const t = useTranslations("account")
  const returnT = useTranslations("returns")
  const exchangeT = useTranslations("exchanges")
  const claimT = useTranslations("claims")
  const [tab, setTab] = useState<"all" | RecordType>("all")

  const filtered = useMemo(
    () =>
      tab === "all" ? records : records.filter((record) => record.type === tab),
    [records, tab]
  )

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-2">
        {[
          ["all", t("afterSalesAll")],
          ["return", t("afterSalesReturns")],
          ["exchange", t("afterSalesExchanges")],
          ["claim", t("afterSalesClaims")],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value as "all" | RecordType)}
            className={`rounded-full border px-3 py-1 text-sm ${
              tab === value
                ? "border-ui-fg-interactive bg-ui-bg-interactive"
                : "border-ui-border-base"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-ui-border-base p-6 text-center">
          <Text>{t("noAfterSales")}</Text>
        </div>
      ) : (
        filtered.map((record) => (
          <LocalizedClientLink
            key={`${record.type}-${record.id}`}
            href={`/account/orders/details/${record.orderId}`}
            className="rounded-lg border border-ui-border-base p-4 hover:border-ui-border-strong"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  color={
                    record.type === "return"
                      ? "blue"
                      : record.type === "exchange"
                      ? "purple"
                      : "orange"
                  }
                >
                  {record.type === "return"
                    ? t("afterSalesReturns")
                    : record.type === "exchange"
                    ? t("afterSalesExchanges")
                    : t("afterSalesClaims")}
                </Badge>
                <Text className="txt-compact-medium">
                  {t("afterSalesOrderLink")} #{record.orderDisplayId}
                </Text>
              </div>
              <Badge
                color={
                  record.status === "canceled"
                    ? "red"
                    : record.status === "completed" ||
                      record.status === "received"
                    ? "green"
                    : "orange"
                }
              >
                {record.type === "return"
                  ? returnT.has(`status.${record.status}`)
                    ? returnT(`status.${record.status}`)
                    : record.status
                  : record.type === "exchange"
                  ? exchangeT.has(`status.${record.status}`)
                    ? exchangeT(`status.${record.status}`)
                    : record.status
                  : claimT.has(`status.${record.status}`)
                  ? claimT(`status.${record.status}`)
                  : record.status}
              </Badge>
            </div>
            <Text className="text-sm text-ui-fg-subtle">
              {new Date(record.createdAt).toLocaleDateString()}
            </Text>
            <Text className="mt-1 text-sm text-ui-fg-subtle">
              {t("afterSalesItems", { count: record.itemsCount })}
              {record.refundAmount && record.refundAmount > 0
                ? ` • ${claimT("refundAmount")}: ${new Intl.NumberFormat(
                    undefined,
                    { style: "currency", currency: currencyCode }
                  ).format(record.refundAmount / 100)}`
                : ""}
            </Text>
          </LocalizedClientLink>
        ))
      )}
    </div>
  )
}

export default AfterSalesHistory
