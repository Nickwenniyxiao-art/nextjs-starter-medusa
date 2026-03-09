"use client"

import { addOrderNote, createFulfillment, createRefund } from "@lib/data/admin"
import { Badge, Button, Input, Label, Text, Textarea, toast } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"

export default function AdminOrderDetail({ order }: { order: any }) {
  const t = useTranslations("admin")
  const [fulfillOpen, setFulfillOpen] = useState(false)
  const [refundOpen, setRefundOpen] = useState(false)
  const [tracking, setTracking] = useState("")
  const [reason, setReason] = useState("")
  const [amount, setAmount] = useState((order.total || 0) / 100)
  const [note, setNote] = useState("")
  const [pending, startTransition] = useTransition()
  const [itemIds, setItemIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  const itemsToFulfill = useMemo(() => (order.items || []).filter((i: any) => (i.detail?.fulfilled_quantity || 0) < i.quantity), [order.items])
  const notes = order.metadata?.admin_notes || []

  const timeline = [
    { label: t("timelineOrderCreated"), at: order.created_at },
    ...((order.payment_collections || []).flatMap((c: any) => (c.payments || []).map((p: any) => p.captured_at ? ({ label: t("timelinePaymentCaptured"), at: p.captured_at }) : null)).filter(Boolean)),
    ...((order.fulfillments || []).map((f: any) => ({ label: t("timelineFulfilled"), at: f.created_at }))),
    ...((order.returns || []).map((r: any) => ({ label: t("timelineReturnRequested"), at: r.created_at }))),
  ].filter((e: any) => e.at).sort((a: any, b: any) => +new Date(a.at) - +new Date(b.at))

  return <div className="space-y-6">
    <div className="rounded border p-4">
      <h1 className="text-2xl-semi mb-2">Order #{order.display_id}</h1>
      <div className="flex gap-2"><Badge>{order.status}</Badge><Badge>{order.payment_status}</Badge><Badge>{order.fulfillment_status}</Badge></div>
      <Text className="mt-2">{order.email}</Text>
      <Text>{new Date(order.created_at).toLocaleString()}</Text>
    </div>

    <table className="w-full text-sm"><thead><tr className="border-b"><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody>
      {(order.items || []).map((i: any) => <tr key={i.id} className="border-b"><td>{i.title}</td><td>{i.quantity}</td><td>{((i.unit_price||0)/100).toFixed(2)}</td><td>{((i.total||0)/100).toFixed(2)}</td></tr>)}
    </tbody></table>

    <div className="flex gap-2">
      {order.fulfillment_status !== "fulfilled" && <Button onClick={() => setFulfillOpen(true)}>{t("createFulfillment")}</Button>}
      {order.payment_status === "captured" && <Button onClick={() => setRefundOpen(true)}>{t("createRefund")}</Button>}
    </div>

    <div className="rounded border p-4"><h3 className="text-lg-semi">{t("orderTimeline")}</h3><ul className="mt-2 space-y-1">{timeline.map((e: any, idx: number) => <li key={idx}>{e.label} - {new Date(e.at).toLocaleString()}</li>)}</ul></div>

    <div className="rounded border p-4 space-y-2"><h3 className="text-lg-semi">{t("orderNotes")}</h3>
      {notes.length === 0 ? <Text className="text-ui-fg-subtle">-</Text> : notes.map((n: any, idx: number) => <div key={idx} className="border rounded p-2"><Text>{n.text}</Text><Text className="text-ui-fg-subtle text-xs">{n.author} · {new Date(n.created_at).toLocaleString()}</Text></div>)}
      <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("notePlaceholder")} />
      <Button disabled={!note.trim() || pending} onClick={() => startTransition(async () => {
        await addOrderNote(order.id, notes, note.trim(), "admin")
        toast.success(t("addNote"))
        setNote("")
        router.refresh()
      })}>{t("addNote")}</Button>
    </div>

    <Modal isOpen={fulfillOpen} close={() => setFulfillOpen(false)}>
      <Modal.Title>{t("createFulfillment")}</Modal.Title>
      <div className="space-y-2 py-2">
        {itemsToFulfill.map((i: any) => <label key={i.id} className="flex gap-2"><input type="checkbox" checked={itemIds.has(i.id)} onChange={() => setItemIds((prev) => {
          const next = new Set(prev)
          if (next.has(i.id)) next.delete(i.id)
          else next.add(i.id)
          return next
        })} />{i.title}</label>)}
        <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder={t("trackingNumber")} />
      </div>
      <Modal.Footer><Button variant="secondary" onClick={() => setFulfillOpen(false)}>{t("cancelAction")}</Button><Button disabled={itemIds.size===0 || pending} onClick={() => startTransition(async () => {
        const payload = itemsToFulfill.filter((i: any) => itemIds.has(i.id)).map((i: any) => ({ id: i.id, quantity: i.quantity - (i.detail?.fulfilled_quantity || 0) }))
        await createFulfillment(order.id, payload, tracking || undefined)
        toast.success(t("fulfillmentCreated"))
        setFulfillOpen(false)
        router.refresh()
      })}>{t("confirmAction")}</Button></Modal.Footer>
    </Modal>

    <Modal isOpen={refundOpen} close={() => setRefundOpen(false)}>
      <Modal.Title>{t("createRefund")}</Modal.Title>
      <div className="space-y-2 py-2">
        <Label>{t("refundAmount")}</Label>
        <Input type="number" min={0.01} step={0.01} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("refundReason")} />
      </div>
      <Modal.Footer><Button variant="secondary" onClick={() => setRefundOpen(false)}>{t("cancelAction")}</Button><Button disabled={pending || amount<=0 || amount > (order.total||0)/100} onClick={() => startTransition(async () => {
        await createRefund(order.id, Math.round(amount * 100), reason || undefined)
        toast.success(t("refundCreated"))
        setRefundOpen(false)
        router.refresh()
      })}>{t("confirmAction")}</Button></Modal.Footer>
    </Modal>
  </div>
}
