"use client"

import { adjustInventory } from "@lib/data/admin"
import { Badge, Button, Input, Textarea, toast } from "@medusajs/ui"
import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"

interface RestockRequest {
  id: string
  sku: string
  productName: string
  quantity: number
  expectedDate: string
  supplierNotes: string
  status: "pending" | "approved" | "received"
  createdAt: string
}

const KEY = "nordhjem_restock_requests"

export default function RestockManager({ items }: { items: any[] }) {
  const t = useTranslations("admin")
  const [pending, startTransition] = useTransition()
  const [sku, setSku] = useState("")
  const [qty, setQty] = useState(1)
  const [expectedDate, setExpectedDate] = useState("")
  const [notes, setNotes] = useState("")
  const [requests, setRequests] = useState<RestockRequest[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(window.localStorage.getItem(KEY) || "[]")
    } catch {
      return []
    }
  })

  const save = (next: RestockRequest[]) => {
    setRequests(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, JSON.stringify(next))
    }
  }

  const selectedItem = useMemo(() => items.find((i) => `${i.sku} - ${i.title}` === sku), [items, sku])

  return <div className="space-y-4">
    <h3 className="text-lg-semi">{t("newRestockRequest")}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div><Input list="restock-skus" value={sku} onChange={(e) => setSku(e.target.value)} placeholder={t("restockSku")} /><datalist id="restock-skus">{items.map((i) => <option key={i.id} value={`${i.sku} - ${i.title}`} />)}</datalist></div>
      <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder={t("restockQuantity")} />
      <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("supplierNotes")} />
    </div>
    <Button disabled={!selectedItem || qty < 1 || !expectedDate} onClick={() => {
      const req: RestockRequest = {
        id: crypto.randomUUID(), sku: selectedItem.sku, productName: selectedItem.title, quantity: qty, expectedDate, supplierNotes: notes, status: "pending", createdAt: new Date().toISOString(),
      }
      save([req, ...requests])
      toast.success(t("requestCreated"))
      setSku(""); setQty(1); setExpectedDate(""); setNotes("")
    }}>{t("submitRequest")}</Button>

    <h3 className="text-lg-semi">{t("restockHistory")}</h3>
    {requests.length === 0 ? <div>{t("noRestockRequests")}</div> : <table className="w-full text-sm"><thead><tr className="border-b"><th>Date</th><th>SKU</th><th>Product</th><th>Qty</th><th>Expected</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead><tbody>
      {[...requests].sort((a,b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map((r) => <tr key={r.id} className="border-b"><td>{new Date(r.createdAt).toLocaleDateString()}</td><td>{r.sku}</td><td>{r.productName}</td><td>{r.quantity}</td><td>{r.expectedDate}</td><td><Badge color={r.status==="received"?"green":r.status==="approved"?"blue":"orange"}>{r.status==="received"?t("statusReceived"):r.status==="approved"?t("statusApproved"):t("statusPending")}</Badge></td><td className="max-w-[240px] truncate" title={r.supplierNotes}>{r.supplierNotes}</td><td className="space-x-2">{r.status!=="received" && <Button size="small" disabled={pending} onClick={() => startTransition(async () => {
        const item = items.find((i) => i.sku === r.sku)
        const level = item?.location_levels?.[0]
        if (!item || !level) {
          toast.error("Inventory item not found")
          return
        }
        try {
          await adjustInventory(item.id, level.location_id, r.quantity, `Restock: ${r.id}`)
          save(requests.map((x) => x.id === r.id ? { ...x, status: "received" } : x))
          toast.success(t("requestReceived"))
        } catch (e: any) {
          toast.error(e.message)
        }
      })}>{t("markReceived")}</Button>}<Button size="small" variant="secondary" onClick={() => { if (confirm(t("confirmDelete"))) save(requests.filter((x) => x.id !== r.id)) }}>{t("deleteRequest")}</Button></td></tr>)}
    </tbody></table>}
  </div>
}
