import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import { NordHjemButton } from "./components/Button"
import { NordHjemFooter } from "./components/Footer"
import { NordHjemHeader } from "./components/Header"

const i18n = {
  en: {
    preview: "Your NordHjem order has shipped",
    title: "Your order is on its way",
    subtitle: "Great news — your order has been shipped and is heading to you.",
    orderNumber: "Order",
    trackingNumber: "Tracking Number",
    items: "Items Shipped",
    shippingTo: "Shipping To",
    trackOrder: "TRACK ORDER",
    noTracking: "VIEW ORDER",
  },
  zh: {
    preview: "您的 NordHjem 订单已发货",
    title: "您的订单已发出",
    subtitle: "好消息 — 您的订单已发货，正在运送途中。",
    orderNumber: "订单号",
    trackingNumber: "追踪号码",
    items: "发货商品",
    shippingTo: "配送地址",
    trackOrder: "追踪物流",
    noTracking: "查看订单",
  },
}

type Props = {
  order: {
    display_id: string
    email: string
    currency_code: string
    items: Array<{
      product_title: string
      variant_title?: string
      thumbnail?: string
      quantity: number
    }>
    shipping_address?: {
      first_name?: string
      last_name?: string
      address_1?: string
      city?: string
      province?: string
      postal_code?: string
      country_code?: string
    }
  }
  fulfillment: {
    tracking_numbers?: string[]
    shipped_at?: string
  }
  trackingUrl?: string
  locale?: string
}

export function shippingNotificationEmail({
  order,
  fulfillment,
  trackingUrl,
  locale = "en",
}: Props) {
  const t = locale === "zh" ? i18n.zh : i18n.en
  const trackingNum = fulfillment.tracking_numbers?.[0]

  return (
    <Html>
      <Head />
      <Preview>
        {t.preview} #{order.display_id}
      </Preview>
      <Body
        style={{
          backgroundColor: "#FAFAFA",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          margin: "0",
          padding: "0",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          <NordHjemHeader />

          <Section style={{ backgroundColor: "#FFFFFF", padding: "48px 40px" }}>
            <Text
              style={{
                fontSize: "22px",
                fontWeight: 300,
                color: "#1A1A2E",
                textAlign: "center" as const,
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              {t.title}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#666",
                textAlign: "center" as const,
                lineHeight: "22px",
                marginBottom: "4px",
              }}
            >
              {t.subtitle}
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "#999",
                textAlign: "center" as const,
                marginBottom: "32px",
              }}
            >
              {t.orderNumber} #{order.display_id}
            </Text>

            {trackingNum && (
              <>
                <Hr style={{ borderColor: "#EEEEEE", marginBottom: "24px" }} />
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    color: "#999",
                    textTransform: "uppercase" as const,
                    marginBottom: "8px",
                  }}
                >
                  {t.trackingNumber}
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#1A1A2E",
                    fontFamily: "monospace",
                    marginBottom: "24px",
                  }}
                >
                  {trackingNum}
                </Text>
              </>
            )}

            <Hr style={{ borderColor: "#EEEEEE", marginBottom: "24px" }} />

            <Text
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "2px",
                color: "#999",
                textTransform: "uppercase" as const,
                marginBottom: "16px",
              }}
            >
              {t.items}
            </Text>

            {order.items?.map((item, i) => (
              <Row key={i} style={{ marginBottom: "12px" }}>
                <Column style={{ width: "48px" }}>
                  {item.thumbnail && (
                    <Img
                      src={item.thumbnail}
                      alt={item.product_title}
                      width="40"
                      height="40"
                      style={{ borderRadius: "6px", objectFit: "cover" as const }}
                    />
                  )}
                </Column>
                <Column style={{ paddingLeft: "12px" }}>
                  <Text style={{ fontSize: "14px", color: "#1A1A2E", margin: "0" }}>
                    {item.product_title} × {item.quantity}
                  </Text>
                  {item.variant_title && (
                    <Text style={{ fontSize: "12px", color: "#999", margin: "0" }}>
                      {item.variant_title}
                    </Text>
                  )}
                </Column>
              </Row>
            ))}

            {order.shipping_address && (
              <>
                <Hr style={{ borderColor: "#EEEEEE", margin: "24px 0" }} />
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    color: "#999",
                    textTransform: "uppercase" as const,
                    marginBottom: "8px",
                  }}
                >
                  {t.shippingTo}
                </Text>
                <Text style={{ fontSize: "14px", color: "#333", lineHeight: "22px" }}>
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                  {"\n"}
                  {order.shipping_address.address_1}
                  {"\n"}
                  {order.shipping_address.city}, {order.shipping_address.province}{" "}
                  {order.shipping_address.postal_code}
                  {"\n"}
                  {order.shipping_address.country_code?.toUpperCase()}
                </Text>
              </>
            )}

            <Section style={{ textAlign: "center" as const, marginTop: "36px" }}>
              <NordHjemButton href={trackingUrl || "https://nordhjem.store/account/orders"}>
                {trackingUrl ? t.trackOrder : t.noTracking}
              </NordHjemButton>
            </Section>
          </Section>

          <NordHjemFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  )
}
