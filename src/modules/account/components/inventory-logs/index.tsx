"use client"

import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

interface LogEntry {
  id: string
  type: "inbound" | "outbound" | "adjustment" | "return"
  quantity: number
  reason?: string
  created_at: string
  user?: string
  running_total?: number
}

const typeColors: Record<string, "green" | "red" | "blue" | "orange"> = {
  inbound: "green",
  outbound: "red",
  adjustment: "blue",
  return: "orange",
}

export default function InventoryLogs({ itemId, logs }: { itemId: string; logs: LogEntry[] }) {
  const t = useTranslations("admin")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("inventoryLogs")} · {itemId}</h1>

      <div className="space-y-0">
        {logs.map((log) => (
          <div key={log.id} className="relative flex items-start gap-4 border-l-2 border-gray-200 pb-6 pl-4">
            <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full" style={{ backgroundColor: log.quantity >= 0 ? "#2C3E2D" : "#dc2626" }} />
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge color={typeColors[log.type] || "grey"}>{t(`logType_${log.type}` as any)}</Badge>
                <Text className="text-sm text-ui-fg-subtle">{new Date(log.created_at).toLocaleString()}</Text>
              </div>
              <Text className="font-medium">
                <span className={log.quantity >= 0 ? "text-green-700" : "text-red-700"}>{log.quantity >= 0 ? "+" : ""}{log.quantity}</span>
                {log.running_total !== undefined && <> · {t("runningTotal")}: {log.running_total}</>}
              </Text>
              <Text className="text-sm text-ui-fg-subtle">{log.reason || "-"}</Text>
              <Text className="text-xs text-ui-fg-subtle">{log.user || "System"}</Text>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p className="text-sm text-grey-50">暂无库存变动日志</p>}
      </div>
    </div>
  )
}
