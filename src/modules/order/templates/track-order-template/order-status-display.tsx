"use client"

import { useLocale, useTranslations } from "next-intl"
import { Container, Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

const statusMap: Record<string, { en: string; zh: string; color: string }> = {
  pending: { en: "Pending", zh: "待处理", color: "text-yellow-600" },
  completed: { en: "Completed", zh: "已完成", color: "text-green-600" },
  archived: { en: "Archived", zh: "已归档", color: "text-gray-600" },
  canceled: { en: "Canceled", zh: "已取消", color: "text-red-600" },
  requires_action: { en: "Requires Action", zh: "需处理", color: "text-orange-600" },
}

const returnStatusMap: Record<string, { en: string; zh: string; color: string }> = {
  requested: { en: "Return Requested", zh: "退货申请已提交", color: "text-yellow-600" },
  received: { en: "Items Received", zh: "商品已收到", color: "text-blue-600" },
  partially_received: { en: "Partially Received", zh: "部分收到", color: "text-blue-500" },
  canceled: { en: "Return Canceled", zh: "退货已取消", color: "text-red-600" },
}

const OrderStatusDisplay = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const t = useTranslations("trackOrder")
  const locale = useLocale()
  const isZh = locale === "zh"

  const orderStatus = statusMap[order.status] || statusMap.pending
  const returns = (order as any).returns || []

  return (
    <div className="flex flex-col gap-y-6">
      <Container className="p-6 bg-white">
        <Heading level="h2" className="text-xl-semi mb-4 text-[#2C3E2D]">
          {t("orderInfo")}
        </Heading>
        <div className="grid grid-cols-2 gap-4 text-small-regular">
          <div>
            <Text className="text-ui-fg-subtle">{t("orderId")}</Text>
            <Text className="text-ui-fg-base font-semibold">
              {order.display_id ? `#${order.display_id}` : order.id}
            </Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle">{t("orderDate")}</Text>
            <Text className="text-ui-fg-base">
              {new Date(order.created_at).toLocaleDateString(isZh ? "zh-CN" : "en-US")}
            </Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle">{t("status")}</Text>
            <Text className={`font-semibold ${orderStatus.color}`}>
              {isZh ? orderStatus.zh : orderStatus.en}
            </Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle">{t("email")}</Text>
            <Text className="text-ui-fg-base">{order.email}</Text>
          </div>
        </div>
      </Container>

      <Container className="p-6 bg-white">
        <Heading level="h2" className="text-xl-semi mb-4 text-[#2C3E2D]">
          {t("items")}
        </Heading>
        <div className="flex flex-col gap-y-3">
          {order.items?.map((item: any) => {
            const name =
              isZh && item.product?.metadata?.name_zh
                ? String(item.product.metadata.name_zh)
                : item.title
            return (
              <div key={item.id} className="flex justify-between text-small-regular">
                <Text className="text-ui-fg-base">
                  {name} × {item.quantity}
                </Text>
                <Text className="text-ui-fg-base">
                  {((item.unit_price * item.quantity) / 100).toFixed(2)}{" "}
                  {order.currency_code?.toUpperCase()}
                </Text>
              </div>
            )
          })}
        </div>
      </Container>

      {returns.length > 0 && (
        <Container className="p-6 bg-white">
          <Heading level="h2" className="text-xl-semi mb-4 text-[#2C3E2D]">
            {t("returnStatus")}
          </Heading>
          {returns.map((ret: any, index: number) => {
            const retStatus = returnStatusMap[ret.status] || {
              en: ret.status,
              zh: ret.status,
              color: "text-gray-600",
            }

            return (
              <div key={ret.id || index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <Text className="text-ui-fg-subtle">
                    {t("returnId")}: {ret.id?.slice(-8)}
                  </Text>
                  <Text className={`font-semibold ${retStatus.color}`}>
                    {isZh ? retStatus.zh : retStatus.en}
                  </Text>
                </div>
                {ret.items?.map((retItem: any) => (
                  <Text key={retItem.id} className="text-small-regular text-ui-fg-subtle ml-2">
                    - {retItem.item?.title || "Item"} × {retItem.quantity}
                    {retItem.reason?.label ? ` (${retItem.reason.label})` : ""}
                  </Text>
                ))}
                <Text className="text-small-regular text-ui-fg-subtle mt-1">
                  {t("returnDate")}: {new Date(ret.created_at).toLocaleDateString(isZh ? "zh-CN" : "en-US")}
                </Text>
              </div>
            )
          })}
        </Container>
      )}

      {returns.length === 0 && (
        <Container className="p-6 bg-white">
          <Text className="text-ui-fg-subtle text-small-regular">{t("noReturns")}</Text>
        </Container>
      )}
    </div>
  )
}

export default OrderStatusDisplay
