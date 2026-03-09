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
  const [tab, setTab] = useState<"stock"|"restock">("stock")
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<any>(null)
  const [type, setType] = useState<"add"|"remove">("add")
  const [qty, setQty] = useState(1)
  const [reason, setReason] = useState("")
  const [pending, startTransition] = useTransition()

  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const updateParam = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    router.push(`${pathname}?${p.toString()}`)
  }

  const stats = useMemo(() => {
    const computed = items.map((i) => {
      const level = i.location_levels?.[0]
      const stocked = level?.stocked_quantity || 0
      const reserved = level?.reserved_quantity || 0
      return { available: stocked - reserved }
    })
    return {
      low: computed.filter((x) => x.available < 10).length,
      out: computed.filter((x) => x.available <= 0).length,
    }
  }, [items])

  return <div className="space-y-4">
    <h1 className="text-2xl-semi">{t("inventoryTitle")}</h1>
    <div className="flex gap-2"><Button variant={tab==="stock"?"primary":"secondary"} onClick={()=>setTab("stock")}>{t("stockLevels")}</Button><Button variant={tab==="restock"?"primary":"secondary"} onClick={()=>setTab("restock")}>{t("restockRequests")}</Button></div>

    {tab === "restock" ? <RestockManager items={items} /> : <>
      <div className="flex gap-2"><Badge>{t("totalSkus")}: {count}</Badge><Badge color="red">{t("lowStockItems")}: {stats.low}</Badge><Badge color="red">{t("outOfStockItems")}: {stats.out}</Badge></div>
      <div className="flex gap-2"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchInventory")} /><Button onClick={() => updateParam({ q: search || undefined, page: "1" })}>Search</Button></div>
      <table className="w-full text-sm"><thead><tr className="border-b"><th>{t("sku")}</th><th>{t("productName")}</th><th>{t("stockedQty")}</th><th>{t("reservedQty")}</th><th>{t("availableQty")}</th><th>Actions</th></tr></thead><tbody>
        {items.length===0 ? <tr><td colSpan={6} className="py-8 text-center">No items found</td></tr> : items.map((i) => {
          const level = i.location_levels?.[0]
          const stocked = level?.stocked_quantity || 0
          const reserved = level?.reserved_quantity || 0
          const available = stocked - reserved
          return <tr key={i.id} className={`border-b ${available < 10 ? "bg-red-50" : ""}`}><td>{i.sku}</td><td>{i.title}</td><td>{stocked}</td><td>{reserved}</td><td className={available < 10 ? "text-red-600" : ""}>{available}</td><td><Button size="small" onClick={() => { setCurrent(i); setOpen(true) }}>{t("adjustStock")}</Button></td></tr>
        })}
      </tbody></table>
      <div className="mt-4 flex items-center justify-center gap-4">{page>1?<button onClick={()=>updateParam({page:String(page-1)})}>{accountT("previousPage")}</button>:<span>{accountT("previousPage")}</span>}<span>{accountT("pageIndicator",{page})}</span>{page<totalPages?<button onClick={()=>updateParam({page:String(page+1)})}>{accountT("nextPage")}</button>:<span>{accountT("nextPage")}</span>}</div>
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
          <div className="flex gap-2"><label><input type="radio" checked={type==="add"} onChange={()=>setType("add")} /> {t("addStock")}</label><label><input type="radio" checked={type==="remove"} onChange={()=>setType("remove")} /> {t("removeStock")}</label></div>
          <Label>{t("adjustmentQty")}</Label><Input type="number" min={1} value={qty} onChange={(e)=>setQty(Number(e.target.value))} />
          <Label>{t("adjustmentReason")}</Label><Textarea value={reason} onChange={(e)=>setReason(e.target.value)} placeholder={t("adjustmentReasonPlaceholder")} />
          <Button disabled={pending || qty<1 || !reason.trim()} onClick={() => startTransition(async () => {
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
  </div>
}
