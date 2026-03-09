"use client"

import { batchFulfill } from "@lib/data/admin"
import { Badge, Button, Input, Text, toast } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"

type Props = { orders: any[]; count: number; page: number; pageSize: number }

export default function AdminOrdersTable({
  orders,
  count,
  page,
  pageSize,
}: Props) {
  const t = useTranslations("admin")
  const accountT = useTranslations("account")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { locale, countryCode } = useParams() as {
    locale: string
    countryCode: string
  }
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [batchStatusOpen, setBatchStatusOpen] = useState(false)
  const [batchStatus, setBatchStatus] = useState("")
  const [exportFrom, setExportFrom] = useState("")
  const [exportTo, setExportTo] = useState("")
  const [exportStatus, setExportStatus] = useState("")
  const [pending, startTransition] = useTransition()

  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const allVisibleSelected =
    orders.length > 0 && orders.every((o) => selected.has(o.id))

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
    const filtered = orders.filter((o) => {
      const d = new Date(o.created_at)
      if (exportFrom && d < new Date(`${exportFrom}T00:00:00`)) return false
      if (exportTo && d > new Date(`${exportTo}T23:59:59`)) return false
      if (exportStatus && o.fulfillment_status !== exportStatus) return false
      return true
    })
    const rows = [
      [
        "Order #",
        "Email",
        "Total",
        "Currency",
        "Payment Status",
        "Fulfillment Status",
        "Date",
      ],
      ...filtered.map((o) => [
        o.display_id,
        o.email || "",
        (o.total || 0) / 100,
        o.currency_code,
        o.payment_status,
        o.fulfillment_status,
        new Date(o.created_at).toISOString(),
      ]),
    ]
    const csv = rows
      .map((r) => r.map((c) => esc(String(c))).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const datePart =
      exportFrom || exportTo
        ? `_${exportFrom || "start"}_${exportTo || "now"}`
        : ""
    a.download = `orders${datePart}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl-semi">{t("orderManagement")}</h1>
      <div className="flex gap-2 flex-wrap">
        {["", "pending", "processing", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s || "all"}
              className="rounded-full border px-3 py-1"
              onClick={() => updateParam({ status: s || undefined, page: "1" })}
            >
              {s === "" ? t("allOrders") : t(`${s}Orders` as any)}
            </button>
          )
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchOrders")}
        />
        <Button
          onClick={() => updateParam({ q: search || undefined, page: "1" })}
        >
          Search
        </Button>
      </div>

      {selected.size > 0 && (
        <div className="rounded border p-3 flex items-center gap-2">
          <Badge>{t("selected", { count: selected.size })}</Badge>
          <Button disabled={pending} onClick={() => setConfirmOpen(true)}>
            {t("batchFulfill")}
          </Button>
          <select
            className="rounded border px-3 py-1 text-sm"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                setBatchStatus(e.target.value)
                setBatchStatusOpen(true)
                e.target.value = ""
              }
            }}
          >
            <option value="">{t("batchUpdateStatus")}</option>
            {["processing", "shipped", "delivered", "cancelled"].map((s) => (
              <option key={s} value={s}>
                {t(`${s}Orders` as any)}
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={exportCsv}>
            {t("exportCsv")}
          </Button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={() =>
                  setSelected(
                    allVisibleSelected
                      ? new Set()
                      : new Set(orders.map((o) => o.id))
                  )
                }
                aria-label={t("selectAll")}
              />
            </th>
            <th>Order #</th>
            <th>{t("customerEmail")}</th>
            <th>Total</th>
            <th>{t("paymentStatus")}</th>
            <th>{t("fulfillmentStatus")}</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center">
                <Text>{t("noOrdersFound")}</Text>
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr
                key={o.id}
                className="border-b cursor-pointer"
                onClick={() =>
                  router.push(
                    `/${locale}/${countryCode}/account/admin/orders/${o.id}`
                  )
                }
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.has(o.id)}
                    onChange={() =>
                      setSelected((prev) => {
                        const next = new Set(prev)
                        if (next.has(o.id)) next.delete(o.id)
                        else next.add(o.id)
                        return next
                      })
                    }
                  />
                </td>
                <td>#{o.display_id}</td>
                <td>{o.email}</td>
                <td>
                  {((o.total || 0) / 100).toFixed(2)}{" "}
                  {o.currency_code?.toUpperCase()}
                </td>
                <td>
                  <Badge>{o.payment_status}</Badge>
                </td>
                <td>
                  <Badge>{o.fulfillment_status}</Badge>
                </td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-center gap-4">
        {page > 1 ? (
          <button onClick={() => updateParam({ page: String(page - 1) })}>
            {accountT("previousPage")}
          </button>
        ) : (
          <span>{accountT("previousPage")}</span>
        )}
        <span>{accountT("pageIndicator", { page })}</span>
        {page < totalPages ? (
          <button onClick={() => updateParam({ page: String(page + 1) })}>
            {accountT("nextPage")}
          </button>
        ) : (
          <span>{accountT("nextPage")}</span>
        )}
      </div>

      <div className="rounded border bg-white p-4 space-y-3">
        <h3 className="text-lg font-semibold">{t("exportOrders")}</h3>
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="text-sm text-ui-fg-subtle">
              {t("exportFrom")}
            </label>
            <Input
              type="date"
              value={exportFrom}
              onChange={(e) => setExportFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-ui-fg-subtle">{t("exportTo")}</label>
            <Input
              type="date"
              value={exportTo}
              onChange={(e) => setExportTo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-ui-fg-subtle">
              {t("exportStatus")}
            </label>
            <select
              className="rounded border px-3 py-2 text-sm"
              value={exportStatus}
              onChange={(e) => setExportStatus(e.target.value)}
            >
              <option value="">{t("allOrders")}</option>
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {t(`${s}Orders` as any)}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={exportCsv}>{t("exportCsv")}</Button>
        </div>
      </div>

      <Modal isOpen={confirmOpen} close={() => setConfirmOpen(false)}>
        <Modal.Title>{t("batchFulfill")}</Modal.Title>
        <Modal.Description>
          {t("batchConfirm", { count: selected.size })}
        </Modal.Description>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            {t("cancelAction")}
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await batchFulfill(Array.from(selected))
                const success = res.filter((r) => r.success).length
                const failed = res.length - success
                toast.success(t("batchComplete", { success, failed }))
                setConfirmOpen(false)
                setSelected(new Set())
                router.refresh()
              })
            }
          >
            {t("confirmAction")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal isOpen={batchStatusOpen} close={() => setBatchStatusOpen(false)}>
        <Modal.Title>{t("batchUpdateStatus")}</Modal.Title>
        <Modal.Description>
          {t("batchStatusConfirm", {
            count: selected.size,
            status: batchStatus,
          })}
        </Modal.Description>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBatchStatusOpen(false)}>
            {t("cancelAction")}
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                toast.success(
                  t("batchStatusComplete", {
                    count: selected.size,
                    status: batchStatus,
                  })
                )
                setBatchStatusOpen(false)
                setSelected(new Set())
                router.refresh()
              })
            }
          >
            {t("confirmAction")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
