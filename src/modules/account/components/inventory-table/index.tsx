"use client"

import { adjustInventory } from "@lib/data/admin"
import { Badge, Button, Input, Label, Text, Textarea, toast } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import RestockManager from "../restock-manager"

export default function InventoryTable({ items, count, page, pageSize }: { items: any[]; count: number; page: number; pageSize: number }) {
  const t = useTranslations("admin")
  const accountT = useTranslations("account")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [tab, setTab] = useState<"stock" | "restock">("stock")
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<any>(null)
  const [type, setType] = useState<"add" | "remove">("add")
  const [qty, setQty] = useState(1)
  const [reason, setReason] = useState("")
  const [pending, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [batchOpen, setBatchOpen] = useState(false)
  const [batchQty, setBatchQty] = useState(0)
  const [batchType, setBatchType] = useState<"add" | "remove">("add")
  const [batchReason, setBatchReason] = useState("")
  const [csvImportOpen, setCsvImportOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const updateParam = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    router.push(`${pathname}?${p.toString()}`)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)))
    }
  }

  const stats = useMemo(() => {
    const computed = items.map((i) => {
      const level = i.location_levels?.[0]
      const stocked = level?.stocked_quantity || 0
      const reserved = level?.reserved_quantity || 0
      return { available: stocked - reserved }
    })
    return {
      low: computed.filter((x) => x.available < 10 && x.available > 0).length,
      out: computed.filter((x) => x.available <= 0).length,
    }
  }, [items])

  return <div className="space-y-4">
    <h1 className="text-2xl-semi">{t("inventoryTitle")}</h1>
    <div className="flex gap-2">
      <Button variant={tab === "stock" ? "primary" : "secondary"} onClick={() => setTab("stock")}>{t("stockLevels")}</Button>
      <Button variant={tab === "restock" ? "primary" : "secondary"} onClick={() => setTab("restock")}>{t("restockRequests")}</Button>
    </div>

    {tab === "restock" ? <RestockManager items={items} /> : <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded border bg-white p-3"><p className="text-sm text-ui-fg-subtle">{t("totalSkus")}</p><p className="mt-1 text-xl font-semibold">{count}</p></div>
        <div className="rounded border bg-white p-3"><p className="text-sm text-ui-fg-subtle">{t("lowStockItems")}</p><p className="mt-1 text-xl font-semibold text-amber-600">{stats.low}</p></div>
        <div className="rounded border bg-white p-3"><p className="text-sm text-ui-fg-subtle">{t("outOfStockItems")}</p><p className="mt-1 text-xl font-semibold text-red-600">{stats.out}</p></div>
        <div className="rounded border bg-white p-3"><p className="text-sm text-ui-fg-subtle">{t("healthyStock")}</p><p className="mt-1 text-xl font-semibold text-green-600">{count - stats.low - stats.out}</p></div>
      </div>

      <div className="flex gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchInventory")} />
        <Button onClick={() => updateParam({ q: search || undefined, page: "1" })}>Search</Button>
        <Button variant="secondary" onClick={() => setCsvImportOpen(true)}>{t("importCsv")}</Button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded border border-forest bg-forest/5 p-3">
          <Badge>{t("selected", { count: selectedIds.size })}</Badge>
          <Button size="small" onClick={() => setBatchOpen(true)}>{t("batchAdjustStock")}</Button>
          <Button size="small" variant="secondary" onClick={() => setSelectedIds(new Set())}>{t("clearSelection")}</Button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2"><input type="checkbox" checked={selectedIds.size === items.length && items.length > 0} onChange={toggleAll} /></th>
            <th>{t("sku")}</th><th>{t("productName")}</th><th>{t("stockedQty")}</th><th>{t("reservedQty")}</th><th>{t("availableQty")}</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? <tr><td colSpan={7} className="py-8 text-center">No items found</td></tr> : items.map((i) => {
            const level = i.location_levels?.[0]
            const stocked = level?.stocked_quantity || 0
            const reserved = level?.reserved_quantity || 0
            const available = stocked - reserved
            return <tr key={i.id} className={`border-b ${available <= 0 ? "bg-red-50" : available < 10 ? "bg-amber-50" : ""}`}>
              <td className="p-2"><input type="checkbox" checked={selectedIds.has(i.id)} onChange={() => toggleSelect(i.id)} /></td>
              <td>{i.sku}</td><td>{i.title}</td><td>{stocked}</td><td>{reserved}</td><td className={available < 10 ? "text-red-600" : ""}>{available}</td>
              <td>
                <div className="flex gap-1">
                  <Button size="small" onClick={() => { setCurrent(i); setOpen(true) }}>{t("adjustStock")}</Button>
                  <Button size="small" variant="secondary" onClick={() => router.push(`${pathname}/${i.id}/logs`)}>{t("viewLogs")}</Button>
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-center gap-4">{page > 1 ? <button onClick={() => updateParam({ page: String(page - 1) })}>{accountT("previousPage")}</button> : <span>{accountT("previousPage")}</span>}<span>{accountT("pageIndicator", { page })}</span>{page < totalPages ? <button onClick={() => updateParam({ page: String(page + 1) })}>{accountT("nextPage")}</button> : <span>{accountT("nextPage")}</span>}</div>
    </>}

    <Modal isOpen={open} close={() => setOpen(false)}>
      <Modal.Title>{t("adjustStockTitle")}</Modal.Title>
      {current && (() => {
        const level = current.location_levels?.[0]
        const stocked = level?.stocked_quantity || 0
        const reserved = level?.reserved_quantity || 0
        const available = stocked - reserved
        return <div className="space-y-2 py-2">
          <Text>{t("currentStock")}: {stocked}/{reserved}/{available}</Text>
          <div className="flex gap-2"><label><input type="radio" checked={type === "add"} onChange={() => setType("add")} /> {t("addStock")}</label><label><input type="radio" checked={type === "remove"} onChange={() => setType("remove")} /> {t("removeStock")}</label></div>
          <Label>{t("adjustmentQty")}</Label><Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <Label>{t("adjustmentReason")}</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("adjustmentReasonPlaceholder")} />
          <Button disabled={pending || qty < 1 || !reason.trim()} onClick={() => startTransition(async () => {
            try {
              const adj = type === "add" ? qty : -qty
              await adjustInventory(current.id, level?.location_id, adj, reason)
              toast.success(t("stockAdjusted"))
              setOpen(false)
              router.refresh()
            } catch (e: any) {
              toast.error(e.message?.includes("below 0") ? t("cannotReduceBelowZero") : e.message)
            }
          })}>{t("confirmAction")}</Button>
        </div>
      })()}
    </Modal>

    <Modal isOpen={batchOpen} close={() => setBatchOpen(false)}>
      <Modal.Title>{t("batchAdjustStock")}</Modal.Title>
      <div className="space-y-3 py-2">
        <Text>{t("batchAdjustConfirm", { count: selectedIds.size })}</Text>
        <div className="flex gap-2">
          <label className="flex items-center gap-1"><input type="radio" checked={batchType === "add"} onChange={() => setBatchType("add")} />{t("addStock")}</label>
          <label className="flex items-center gap-1"><input type="radio" checked={batchType === "remove"} onChange={() => setBatchType("remove")} />{t("removeStock")}</label>
        </div>
        <Label>{t("adjustmentQty")}</Label>
        <Input type="number" min={1} value={batchQty} onChange={(e) => setBatchQty(Number(e.target.value))} />
        <Label>{t("adjustmentReason")}</Label>
        <Textarea value={batchReason} onChange={(e) => setBatchReason(e.target.value)} placeholder={t("adjustmentReasonPlaceholder")} />
        <Button
          disabled={pending || batchQty < 1 || !batchReason.trim()}
          onClick={() => startTransition(async () => {
            let success = 0
            let fail = 0
            for (const id of Array.from(selectedIds)) {
              try {
                const item = items.find((x) => x.id === id)
                const level = item?.location_levels?.[0]
                if (level) {
                  const adj = batchType === "add" ? batchQty : -batchQty
                  await adjustInventory(id, level.location_id, adj, batchReason)
                  success++
                }
              } catch {
                fail++
              }
            }
            toast.success(t("batchAdjustComplete", { success, fail }))
            setBatchOpen(false)
            setSelectedIds(new Set())
            setBatchQty(0)
            setBatchReason("")
            router.refresh()
          })}
        >
          {t("confirmAction")}
        </Button>
      </div>
    </Modal>

    <Modal isOpen={csvImportOpen} close={() => setCsvImportOpen(false)}>
      <Modal.Title>{t("importCsv")}</Modal.Title>
      <div className="space-y-3 py-2">
        <Text className="text-sm text-ui-fg-subtle">{t("csvImportDesc")}</Text>
        <Text className="rounded bg-gray-50 p-2 font-mono text-xs">SKU,Quantity,Reason</Text>
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const text = await file.text()
            const lines = text.trim().split("\n").slice(1)
            let success = 0
            let fail = 0
            for (const line of lines) {
              const [sku, qty, reason] = line.split(",").map((s) => s.trim())
              const item = items.find((x) => x.sku === sku)
              if (item) {
                try {
                  const level = item.location_levels?.[0]
                  if (level) {
                    await adjustInventory(item.id, level.location_id, Number(qty), reason || "CSV import")
                    success++
                  }
                } catch {
                  fail++
                }
              } else {
                fail++
              }
            }
            toast.success(t("batchAdjustComplete", { success, fail }))
            setCsvImportOpen(false)
            router.refresh()
          }}
        />
      </div>
    </Modal>
  </div>
}
