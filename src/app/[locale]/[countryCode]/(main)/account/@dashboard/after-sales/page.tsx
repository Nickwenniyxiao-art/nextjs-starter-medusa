import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import AfterSalesHistory from "@modules/account/components/after-sales-history"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account")
  return {
    title: t("afterSales"),
    description: t("afterSalesDescription"),
  }
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function AfterSalesPage(props: Props) {
  const customer = await retrieveCustomer().catch(() => null)
  const { countryCode } = await props.params
  const t = await getTranslations("account")

  if (!customer) {
    redirect(`/${countryCode}/account`)
  }

  const orders = (await listOrders(100, 0).catch(() => [])) || []

  const records = orders
    .flatMap((order) => {
      const returns = (order as any).returns || []
      const exchanges = (order as any).exchanges || []
      const claims = (order as any).claims || []

      return [
        ...returns.map((ret: any) => ({
          id: ret.id,
          type: "return" as const,
          orderId: order.id,
          orderDisplayId: order.display_id,
          createdAt: ret.created_at,
          status: ret.status || "active",
          itemsCount: ret.items?.length || 0,
          refundAmount: ret.refund_amount,
        })),
        ...exchanges.map((exchange: any) => ({
          id: exchange.id,
          type: "exchange" as const,
          orderId: order.id,
          orderDisplayId: order.display_id,
          createdAt: exchange.created_at,
          status: exchange.canceled_at ? "canceled" : "active",
          itemsCount: (exchange.additional_items || []).length,
        })),
        ...claims.map((claim: any) => ({
          id: claim.id,
          type: "claim" as const,
          orderId: order.id,
          orderDisplayId: order.display_id,
          createdAt: claim.created_at,
          status: claim.canceled_at ? "canceled" : "active",
          itemsCount: (claim.claim_items || []).length,
          refundAmount: claim.refund_amount,
        })),
      ]
    })
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

  return (
    <div className="w-full" data-testid="after-sales-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("afterSales")}</h1>
        <p className="text-base-regular">{t("afterSalesDescription")}</p>
      </div>
      <AfterSalesHistory
        records={records}
        currencyCode={orders[0]?.currency_code || "USD"}
      />
    </div>
  )
}
