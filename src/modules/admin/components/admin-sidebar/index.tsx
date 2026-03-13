"use client"

import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

const adminNav = [
  { label: "🏠 仪表盘总览", href: "/account/admin" },
  {
    label: "📦 订单管理",
    href: "/account/admin/orders",
    children: [{ label: "订单列表", href: "/account/admin/orders" }],
  },
  {
    label: "📦 库存管理",
    href: "/account/admin/inventory",
    children: [
      { label: "库存列表", href: "/account/admin/inventory" },
      { label: "低库存预警", href: "/account/admin/inventory/alerts" },
    ],
  },
  {
    label: "💰 财务管理",
    href: "/account/admin/finance",
    children: [
      { label: "财务概览", href: "/account/admin/finance" },
      { label: "货币报表", href: "/account/admin/finance/currencies" },
      { label: "对账中心", href: "/account/admin/finance/reconciliation" },
      { label: "税务配置", href: "/account/admin/finance/tax" },
      { label: "退款报告", href: "/account/admin/finance/refunds" },
    ],
  },
  {
    label: "🧾 售后工单",
    href: "/account/admin/tickets",
    children: [
      { label: "工单列表", href: "/account/admin/tickets" },
      { label: "SLA 配置", href: "/account/admin/after-sales/sla" },
    ],
  },
  {
    label: "🔐 安全",
    href: "/account/admin/security",
    children: [
      { label: "安全概览", href: "/account/admin/security" },
      { label: "审计日志", href: "/account/admin/security/audit-logs" },
      { label: "事件汇总", href: "/account/admin/security/events" },
    ],
  },
]

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="rounded-2xl border border-grey-20 bg-white p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-grey-60">
        Admin Console
      </h2>
      <nav className="space-y-1">
        {adminNav.map((item) => {
          const active = isActivePath(pathname ?? "", item.href)

          return (
            <div key={item.href}>
              <LocalizedClientLink
                href={item.href}
                className={clx(
                  "block rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-forest text-white"
                    : "text-grey-70 hover:bg-warm-dark"
                )}
              >
                {item.label}
              </LocalizedClientLink>
              {item.children && (
                <div className="mt-1 space-y-1 pl-3">
                  {item.children.map((child) => {
                    const childActive = isActivePath(pathname ?? "", child.href)

                    return (
                      <LocalizedClientLink
                        key={child.href}
                        href={child.href}
                        className={clx(
                          "block rounded-lg px-3 py-1.5 text-sm transition",
                          childActive
                            ? "bg-warm-dark text-forest"
                            : "text-grey-50 hover:bg-grey-10"
                        )}
                      >
                        {child.label}
                      </LocalizedClientLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
