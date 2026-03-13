"use client"

import { InventoryLogEntry } from "@lib/data/admin"
import { Badge, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"

const typeColors: Record<string, "green" | "red" | "blue" | "orange"> = {
  inbound: "green",
  outbound: "red",
  adjustment: "blue",
  return: "orange",
}

export default function InventoryLogs({
  logs,
  itemId,
}: {
  logs: InventoryLogEntry[]
  itemId: string
}) {
  const t = useTranslations("admin")

  let runningTotal = 0
  const logsWithTotal = logs.map((log) => {
    runningTotal += log.quantity
    return { ...log, runningTotal }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {t("inventoryLogs")} · {itemId}
      </h1>

      <div className="space-y-0">
        {logsWithTotal.length === 0 ? (
          <p className="py-8 text-center text-sm text-ui-fg-subtle">
            {t("noLogsFound") || "No logs found"}
          </p>
        ) : (
          logsWithTotal.map((log) => (
            <div
              key={log.id}
              className="relative flex items-start gap-4 border-l-2 border-gray-200 pb-6 pl-4"
            >
              <div
                className="absolute -left-[5px] top-1 h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    log.quantity >= 0 ? "#2C3E2D" : "#dc2626",
                }}
              />
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge color={typeColors[log.type]}>
                    {t(`logType_${log.type}` as any)}
                  </Badge>
                  <Text className="text-sm text-ui-fg-subtle">
                    {new Date(log.created_at).toLocaleString()}
                  </Text>
                </div>
                <Text className="font-medium">
                  <span
                    className={
                      log.quantity >= 0 ? "text-green-700" : "text-red-700"
                    }
                  >
                    {log.quantity >= 0 ? "+" : ""}
                    {log.quantity}
                  </span>
                  {" · "}
                  {t("runningTotal")}: {log.runningTotal}
                </Text>
                <Text className="text-sm text-ui-fg-subtle">{log.reason}</Text>
                <Text className="text-xs text-ui-fg-subtle">{log.user}</Text>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
