"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { resetCrispSession } from "@modules/common/components/crisp-chat"

const AccountNav = ({
  customer,
  isAdminUser = false,
}: {
  customer: HttpTypes.StoreCustomer | null
  isAdminUser?: boolean
}) => {
  const route = usePathname()
  const { countryCode, locale } = useParams() as { countryCode: string; locale: string }
  const isZh = locale?.startsWith("zh")
  const t = useTranslations("account")
  const adminT = useTranslations("admin")

  const handleLogout = async () => {
    resetCrispSession()
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>{t("overview")}</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8">
              Hello {customer?.first_name}
            </div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>{t("profileLabel")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>{t("addressesLabel")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>{t("ordersLabel")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/after-sales"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="after-sales-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>{t("afterSales")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>

                {isAdminUser && (
                  <>
                    <li className="px-8 pt-4 text-sm font-semibold">
                      {adminT("admin")}
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/orders"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      >
                        <div className="flex items-center gap-x-2">
                          <Package size={20} />
                          <span>{adminT("orderManagement")}</span>
                        </div>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/inventory"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      >
                        <div className="flex items-center gap-x-2">
                          <Package size={20} />
                          <span>{adminT("inventory")}</span>
                        </div>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/inventory/alerts"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-12"
                      >
                        <span>{adminT("inventoryAlerts")}</span>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/analytics"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      >
                        <div className="flex items-center gap-x-2">
                          <Package size={20} />
                          <span>{adminT("analytics")}</span>
                        </div>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/analytics/reports"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-12"
                      >
                        <span>{adminT("customReports")}</span>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/analytics/funnel"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-12"
                      >
                        <span>{adminT("funnelAnalysis")}</span>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/finance"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      >
                        <div className="flex items-center gap-x-2">
                          <Package size={20} />
                          <span>{adminT("finance")}</span>
                        </div>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/finance/currencies"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-12"
                      >
                        <span>{adminT("currencyReport")}</span>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/finance/reconciliation"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-12"
                      >
                        <span>{adminT("reconciliation")}</span>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/finance/tax"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-12"
                      >
                        <span>{adminT("taxConfig")}</span>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/tickets"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      >
                        <div className="flex items-center gap-x-2">
                          <Package size={20} />
                          <span>{adminT("tickets")}</span>
                        </div>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/account/admin/cms"
                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                        data-testid="admin-cms-link"
                      >
                        <div className="flex items-center gap-x-2">
                          <Package size={20} />
                          <span>{isZh ? "内容管理" : "CMS"}</span>
                        </div>
                        <ChevronDown className="transform -rotate-90" />
                      </LocalizedClientLink>
                    </li>
                  </>
                )}
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>{t("logOut")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <div className="pb-4">
            <h3 className="text-base-semi">{t("overview")}</h3>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  {t("overview")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  {t("profileLabel")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  {t("addressesLabel")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  {t("ordersLabel")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/after-sales"
                  route={route!}
                  data-testid="after-sales-link"
                >
                  {t("afterSales")}
                </AccountNavLink>
              </li>

              {isAdminUser && (
                <>
                  <li className="pt-4 text-sm font-semibold">
                    {adminT("admin")}
                  </li>
                  <li>
                    <AccountNavLink href="/account/admin/orders" route={route!}>
                      {adminT("orderManagement")}
                    </AccountNavLink>
                  </li>
                  <li>
                    <AccountNavLink
                      href="/account/admin/inventory"
                      route={route!}
                    >
                      {adminT("inventory")}
                    </AccountNavLink>
                  </li>
                  <li className="ml-4">
                    <AccountNavLink
                      href="/account/admin/inventory/alerts"
                      route={route!}
                    >
                      {adminT("inventoryAlerts")}
                    </AccountNavLink>
                  </li>
                  <li>
                    <AccountNavLink
                      href="/account/admin/analytics"
                      route={route!}
                    >
                      {adminT("analytics")}
                    </AccountNavLink>
                  </li>
                  <li className="ml-4">
                    <AccountNavLink
                      href="/account/admin/analytics/reports"
                      route={route!}
                    >
                      {adminT("customReports")}
                    </AccountNavLink>
                  </li>
                  <li className="ml-4">
                    <AccountNavLink
                      href="/account/admin/analytics/funnel"
                      route={route!}
                    >
                      {adminT("funnelAnalysis")}
                    </AccountNavLink>
                  </li>
                  <li>
                    <AccountNavLink
                      href="/account/admin/finance"
                      route={route!}
                    >
                      {adminT("finance")}
                    </AccountNavLink>
                  </li>
                  <li className="ml-4">
                    <AccountNavLink
                      href="/account/admin/finance/currencies"
                      route={route!}
                    >
                      {adminT("currencyReport")}
                    </AccountNavLink>
                  </li>
                  <li className="ml-4">
                    <AccountNavLink
                      href="/account/admin/finance/reconciliation"
                      route={route!}
                    >
                      {adminT("reconciliation")}
                    </AccountNavLink>
                  </li>
                  <li className="ml-4">
                    <AccountNavLink
                      href="/account/admin/finance/tax"
                      route={route!}
                    >
                      {adminT("taxConfig")}
                    </AccountNavLink>
                  </li>
                  <li>
                    <AccountNavLink
                      href="/account/admin/tickets"
                      route={route!}
                    >
                      {adminT("tickets")}
                    </AccountNavLink>
                  </li>
                  <li>
                    <AccountNavLink
                      href="/account/admin/cms"
                      route={route!}
                      data-testid="admin-cms-link"
                    >
                      {isZh ? "内容管理" : "CMS"}
                    </AccountNavLink>
                  </li>
                </>
              )}
              <li className="text-grey-700">
                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  {t("logOut")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx("text-ui-fg-subtle hover:text-ui-fg-base", {
        "text-ui-fg-base font-semibold": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
