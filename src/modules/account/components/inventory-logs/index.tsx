"use client"

import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface LogEntry {
  id: string
  type: "inbound" | "outbound" | "adjustment" | "return"
  quantity: number
  reason: string
  createdAt: string
  user: string
}

const MOCK_LOGS: LogEntry[] = [
  { id: "log_1", type: "inbound", quantity: 100, reason: "Initial stock", createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), user: "System" },
  { id: "log_2", type: "outbound", quantity: -1, reason: "Order #5 fulfillment", createdAt: new Date(Date.now() - 86400000 * 25).toISOString(), user: "System" },
  { id: "log_3", type: "adjustment", quantity: 50, reason: "Restock from supplier", createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), user: "admin@nordhjem.com" },
  { id: "log_4", type: "outbound", quantity: -2, reason: "Order #8 fulfillment", createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), user: "System" },
  { id: "log_5", type: "return", quantity: 1, reason: "Return received - damaged item", createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), user: "System" },
  { id: "log_6", type: "adjustment", quantity: -5, reason: "Damaged in warehouse", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), user: "admin@nordhjem.com" },
  { id: "log_7", type: "inbound", quantity: 200, reason: "Seasonal restock", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), user: "admin@nordhjem.com" },
  { id: "log_8", type: "outbound", quantity: -3, reason: "Order #12 fulfillment", createdAt: new Date(Date.now() - 86400000).toISOString(), user: "System" },
]

const typeColors: Record<string, "green" | "red" | "blue" | "orange"> = {
  inbound: "green",
  outbound: "red",
  adjustment: "blue",
  return: "orange",
}

export default function InventoryLogs({ itemId }: { itemId: string }) {
  const t = useTranslations("admin")

  let runningTotal = 0
  const logsWithTotal = MOCK_LOGS.map((log) => {
    runningTotal += log.quantity
    return { ...log, runningTotal }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("inventoryLogs")} · {itemId}</h1>
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">{t("mockDataNotice")}</p>

      <div className="space-y-0">
        {logsWithTotal.map((log) => (
          <div key={log.id} className="relative flex items-start gap-4 border-l-2 border-gray-200 pb-6 pl-4">
            <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full" style={{ backgroundColor: log.quantity >= 0 ? "#2C3E2D" : "#dc2626" }} />
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge color={typeColors[log.type]}>
                  {t(`logType_${log.type}` as any)}
                </Badge>
                <Text className="text-sm text-ui-fg-subtle">{new Date(log.createdAt).toLocaleString()}</Text>
              </div>
              <Text className="font-medium">
                <span className={log.quantity >= 0 ? "text-green-700" : "text-red-700"}>{log.quantity >= 0 ? "+" : ""}{log.quantity}</span>
                {" · "}{t("runningTotal")}: {log.runningTotal}
              </Text>
              <Text className="text-sm text-ui-fg-subtle">{log.reason}</Text>
              <Text className="text-xs text-ui-fg-subtle">{log.user}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
