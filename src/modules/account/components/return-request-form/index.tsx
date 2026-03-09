"use client"

import { Button, Input, Text, Textarea } from "@medusajs/ui"
import { useState } from "react"
import { useTranslations } from "next-intl"

const RETURN_REASONS = [
  { id: "size", label_en: "Size doesn't fit", label_zh: "尺寸不合" },
  { id: "color", label_en: "Color difference", label_zh: "颜色差异" },
  {
    id: "material",
    label_en: "Material unsatisfactory",
    label_zh: "材质不满意",
  },
  { id: "damage", label_en: "Shipping damage", label_zh: "运输损坏" },
  { id: "wrong", label_en: "Wrong item sent", label_zh: "错发商品" },
]

interface OrderItem {
  id: string
  title: string
  quantity: number
}

const MOCK_ORDER_ITEMS: OrderItem[] = [
  { id: "item_1", title: "Lind 3-Seat Sofa", quantity: 1 },
  { id: "item_2", title: "Berg Coffee Table", quantity: 2 },
  { id: "item_3", title: "Vik Floor Lamp", quantity: 1 },
]

type Step = "select_items" | "select_reason" | "review" | "submitted"

export default function ReturnRequestForm({ orderId }: { orderId?: string }) {
  const t = useTranslations("returns")
  const [step, setStep] = useState<Step>("select_items")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setQuantities((q) => {
          const n = { ...q }
          delete n[id]
          return n
        })
      } else {
        next.add(id)
        setQuantities((q) => ({ ...q, [id]: 1 }))
      }
      return next
    })
  }

  if (step === "submitted") {
    return (
      <div className="space-y-4 text-center py-12">
        <div className="text-4xl">✓</div>
        <h2 className="text-xl font-semibold">{t("requestSubmitted")}</h2>
        <Text>{t("requestSubmittedDesc")}</Text>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("newReturnRequest")}</h1>
      {orderId && (
        <Text className="text-ui-fg-subtle">
          {t("forOrder")} #{orderId}
        </Text>
      )}

      <div className="flex gap-4 text-sm">
        {(["select_items", "select_reason", "review"] as const).map(
          (s, idx) => (
            <div
              key={s}
              className={`flex items-center gap-1 ${
                step === s ? "font-semibold text-forest" : "text-ui-fg-subtle"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  step === s ? "bg-forest text-white" : "bg-gray-200"
                }`}
              >
                {idx + 1}
              </span>
              {t(`step_${s}` as any)}
            </div>
          )
        )}
      </div>

      {step === "select_items" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("selectItems")}</h2>
          {MOCK_ORDER_ITEMS.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 rounded border p-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleItem(item.id)}
              />
              <div className="flex-1">
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-sm text-ui-fg-subtle">
                  {t("maxQty")}: {item.quantity}
                </Text>
              </div>
              {selectedItems.has(item.id) && item.quantity > 1 && (
                <Input
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={quantities[item.id] || 1}
                  onChange={(e) =>
                    setQuantities((q) => ({
                      ...q,
                      [item.id]: Math.min(
                        Number(e.target.value),
                        item.quantity
                      ),
                    }))
                  }
                  className="w-16"
                />
              )}
            </label>
          ))}
          <Button
            disabled={selectedItems.size === 0}
            onClick={() => setStep("select_reason")}
          >
            {t("next")}
          </Button>
        </div>
      )}

      {step === "select_reason" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("selectReason")}</h2>
          {RETURN_REASONS.map((r) => (
            <label
              key={r.id}
              className={`flex items-center gap-3 rounded border p-3 cursor-pointer ${
                reason === r.id ? "border-forest bg-forest/5" : ""
              }`}
            >
              <input
                type="radio"
                name="reason"
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
              />
              <Text>{r.label_en}</Text>
            </label>
          ))}
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("additionalNotes")}
            rows={3}
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep("select_items")}>
              {t("back")}
            </Button>
            <Button disabled={!reason} onClick={() => setStep("review")}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("reviewRequest")}</h2>
          <div className="rounded border p-4 space-y-2">
            <Text className="font-medium">{t("selectedItems")}:</Text>
            {MOCK_ORDER_ITEMS.filter((i) => selectedItems.has(i.id)).map(
              (item) => (
                <Text key={item.id}>
                  • {item.title} × {quantities[item.id] || 1}
                </Text>
              )
            )}
            <Text className="font-medium mt-2">{t("reason")}:</Text>
            <Text>{RETURN_REASONS.find((r) => r.id === reason)?.label_en}</Text>
            {notes && (
              <>
                <Text className="font-medium mt-2">{t("notes")}:</Text>
                <Text>{notes}</Text>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setStep("select_reason")}
            >
              {t("back")}
            </Button>
            <Button onClick={() => setStep("submitted")}>
              {t("submitRequest")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
