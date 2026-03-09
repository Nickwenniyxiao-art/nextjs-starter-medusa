import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { redirect } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import { getTranslations } from "next-intl/server"
import { retrieveCustomer } from "@lib/data/customer"

const ORDERS_PER_PAGE = 10

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account")

  return {
    title: t("orders"),
    description: t("ordersDescription"),
  }
}

export default async function Orders(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const customer = await retrieveCustomer().catch(() => null)
  const t = await getTranslations("account")

  if (!customer) {
    redirect(`/${params.countryCode}/account?redirect=orders`)
  }

  const parsedPage = Number.parseInt(searchParams.page || "1", 10)
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage)
  const offset = (currentPage - 1) * ORDERS_PER_PAGE

  const orders = await listOrders(ORDERS_PER_PAGE, offset)

  if (!orders || orders.length === 0) {
    if (currentPage === 1) {
      return (
        <div className="w-full" data-testid="orders-page-wrapper">
          <div className="mb-8 flex flex-col gap-y-4">
            <h1 className="text-2xl-semi">{t("orders")}</h1>
            <p className="text-base-regular">{t("noOrdersYet")}</p>
          </div>
        </div>
      )
    }

    redirect(`/${params.countryCode}/account/orders`)
  }

  const hasNextPage = orders.length === ORDERS_PER_PAGE
  const hasPrevPage = currentPage > 1

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("orders")}</h1>
        <p className="text-base-regular">{t("ordersDescription")}</p>
      </div>
      <div>
        <OrderOverview orders={orders} />

        {(hasPrevPage || hasNextPage) && (
          <div className="mt-8 flex items-center justify-center gap-4">
            {hasPrevPage ? (
              <a
                href={`?page=${currentPage - 1}`}
                className="text-sm text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                {t("previousPage")}
              </a>
            ) : (
              <span className="text-sm text-ui-fg-disabled">
                {t("previousPage")}
              </span>
            )}

            <span className="text-sm text-ui-fg-subtle">
              {t("pageIndicator", { page: currentPage })}
            </span>

            {hasNextPage ? (
              <a
                href={`?page=${currentPage + 1}`}
                className="text-sm text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                {t("nextPage")}
              </a>
            ) : (
              <span className="text-sm text-ui-fg-disabled">
                {t("nextPage")}
              </span>
            )}
          </div>
        )}

        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
