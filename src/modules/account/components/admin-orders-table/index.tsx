"use client"

import { batchFulfill } from "@lib/data/admin"
import { Badge, Button, Input, Text, toast } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"

type Props = { orders: any[]; count: number; page: number; pageSize: number }

export default function AdminOrdersTable({ orders, count, page, pageSize }: Props) {
  const t = useTranslations("admin")
  const accountT = useTranslations("account")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { locale, countryCode } = useParams() as { locale: string; countryCode: string }
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const allVisibleSelected = orders.length > 0 && orders.every((o) => selected.has(o.id))

  const updateParam = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (!v) p.delete(k)
      else p.set(k, v)
    })
    if (!next.page) p.set("page", "1")
    router.push(`${pathname}?${p.toString()}`)
  }

  const exportCsv = () => {
    const esc = (v: string) => `"${(v || "").replaceAll('"', '""')}"`
    const rows = [
      ["Order #", "Email", "Total", "Currency", "Payment Status", "Fulfillment Status", "Date"],
      ...orders.map((o) => [o.display_id, o.email || "", (o.total || 0) / 100, o.currency_code, o.payment_status, o.fulfillment_status, new Date(o.created_at).toISOString()]),
    ]
    const csv = rows.map((r) => r.map((c) => esc(String(c))).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl-semi">{t("orderManagement")}</h1>
      <div className="flex gap-2 flex-wrap">
        {["", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
          <button key={s || "all"} className="rounded-full border px-3 py-1" onClick={() => updateParam({ status: s || undefined, page: "1" })}>
            {s === "" ? t("allOrders") : t(`${s}Orders` as any)}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchOrders")} />
        <Button onClick={() => updateParam({ q: search || undefined, page: "1" })}>Search</Button>
      </div>

      {selected.size > 0 && (
        <div className="rounded border p-3 flex items-center gap-2">
          <Badge>{t("selected", { count: selected.size })}</Badge>
          <Button disabled={pending} onClick={() => setConfirmOpen(true)}>{t("batchFulfill")}</Button>
          <Button variant="secondary" onClick={exportCsv}>{t("exportCsv")}</Button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead><tr className="border-b">
          <th><input type="checkbox" checked={allVisibleSelected} onChange={() => setSelected(allVisibleSelected ? new Set() : new Set(orders.map((o) => o.id)))} aria-label={t("selectAll")} /></th>
          <th>Order #</th><th>{t("customerEmail")}</th><th>Total</th><th>{t("paymentStatus")}</th><th>{t("fulfillmentStatus")}</th><th>Date</th>
        </tr></thead>
        <tbody>
          {orders.length === 0 ? <tr><td colSpan={7} className="py-8 text-center"><Text>{t("noOrdersFound")}</Text></td></tr> : orders.map((o) => (
            <tr key={o.id} className="border-b cursor-pointer" onClick={() => router.push(`/${locale}/${countryCode}/account/admin/orders/${o.id}`)}>
              <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.has(o.id)} onChange={() => setSelected((prev) => {
                const next = new Set(prev)
                if (next.has(o.id)) next.delete(o.id)
                else next.add(o.id)
                return next
              })} /></td>
              <td>#{o.display_id}</td><td>{o.email}</td><td>{((o.total || 0) / 100).toFixed(2)} {o.currency_code?.toUpperCase()}</td>
              <td><Badge>{o.payment_status}</Badge></td><td><Badge>{o.fulfillment_status}</Badge></td><td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-center gap-4">
        {page > 1 ? <button onClick={() => updateParam({ page: String(page - 1) })}>{accountT("previousPage")}</button> : <span>{accountT("previousPage")}</span>}
        <span>{accountT("pageIndicator", { page })}</span>
        {page < totalPages ? <button onClick={() => updateParam({ page: String(page + 1) })}>{accountT("nextPage")}</button> : <span>{accountT("nextPage")}</span>}
      </div>

      <Modal isOpen={confirmOpen} close={() => setConfirmOpen(false)}>
        <Modal.Title>{t("batchFulfill")}</Modal.Title>
        <Modal.Description>{t("batchConfirm", { count: selected.size })}</Modal.Description>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>{t("cancelAction")}</Button>
          <Button disabled={pending} onClick={() => startTransition(async () => {
            const res = await batchFulfill(Array.from(selected))
            const success = res.filter((r) => r.success).length
            const failed = res.length - success
            toast.success(t("batchComplete", { success, failed }))
            setConfirmOpen(false)
            setSelected(new Set())
            router.refresh()
          })}>{t("confirmAction")}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
