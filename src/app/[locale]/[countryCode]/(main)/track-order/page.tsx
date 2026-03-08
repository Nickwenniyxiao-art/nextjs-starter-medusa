import { Metadata } from "next"
import TrackOrderTemplate from "@modules/order/templates/track-order-template"

type Props = {
  params: Promise<{ countryCode: string; locale: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale || "en"

  return {
    title: locale === "zh" ? "订单查询 | NordHjem" : "Track Order | NordHjem",
    description:
      locale === "zh"
        ? "输入订单号和邮箱查询订单状态"
        : "Enter your order number and email to track your order",
  }
}

export default async function TrackOrderPage(props: Props) {
  const params = await props.params

  return <TrackOrderTemplate countryCode={params.countryCode} />
}
