import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { redirect } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import { getTranslations } from "next-intl/server"
import { retrieveCustomer } from "@lib/data/customer"

type Props = {
  params: Promise<{ countryCode: string }>
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
  const customer = await retrieveCustomer().catch(() => null)
  const t = await getTranslations("account")

  if (!customer) {
    redirect(`/${params.countryCode}/account?redirect=orders`)
  }

  const orders = await listOrders()

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full" data-testid="orders-page-wrapper">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl-semi">{t("orders")}</h1>
          <p className="text-base-regular">{t("noOrdersYet")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("orders")}</h1>
        <p className="text-base-regular">{t("ordersDescription")}</p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
