"use client"

import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

const adminNav = [
  { label: "🏠 仪表盘", href: "/account/admin" },
  {
    label: "📦 订单管理",
    href: "/account/admin/oms",
    children: [
      { label: "订单列表", href: "/account/admin/oms/orders" },
      { label: "发货管理", href: "/account/admin/oms/shipments" },
    ],
  },
  { label: "🛍️ 产品管理", href: "/app/products", external: true },
  { label: "👥 客户管理", href: "/account/admin/crm" },
  { label: "📊 数据分析", href: "/account/admin/analytics" },
  { label: "💰 财务报表", href: "/account/admin/finance" },
  { label: "📦 库存管理", href: "/account/admin/inventory" },
  { label: "🧾 售后工单", href: "/account/admin/after-sales" },
  { label: "🔐 权限管理", href: "/account/admin/permissions" },
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
          const active = isActivePath(pathname, item.href)

          if (item.external) {
            return (
              <a
                key={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-grey-70 transition hover:bg-warm-dark"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            )
          }

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
                    const childActive = isActivePath(pathname, child.href)

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
