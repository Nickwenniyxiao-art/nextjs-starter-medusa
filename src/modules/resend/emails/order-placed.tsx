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
    preview: "Thank you for your NordHjem order",
    title: "Thank you for your order",
    subtitle:
      "We're preparing your items with care. You'll receive a shipping notification once your order is on its way.",
    orderNumber: "Order",
    items: "Your Items",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    shippingTo: "Shipping To",
    viewOrder: "VIEW ORDER",
  },
  zh: {
    preview: "感谢您的 NordHjem 订单",
    title: "感谢您的订单",
    subtitle: "我们正在精心准备您的商品。发货后会第一时间通知您。",
    orderNumber: "订单号",
    items: "订单商品",
    subtotal: "小计",
    shipping: "运费",
    tax: "税费",
    total: "合计",
    shippingTo: "配送地址",
    viewOrder: "查看订单",
  },
}

type OrderItem = {
  product_title: string
  variant_title?: string
  thumbnail?: string
  quantity: number
  total: number
}

type OrderData = {
  display_id: string
  email: string
  currency_code: string
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  items: OrderItem[]
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

type Props = { order: OrderData; locale?: string }

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)

export function orderPlacedEmail({ order, locale = "en" }: Props) {
  const t = locale === "zh" ? i18n.zh : i18n.en
  const curr = order.currency_code || "usd"

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

            <Hr style={{ borderColor: "#EEEEEE", marginBottom: "32px" }} />

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
              <Row key={i} style={{ marginBottom: "16px" }}>
                <Column style={{ width: "64px" }}>
                  {item.thumbnail && (
                    <Img
                      src={item.thumbnail}
                      alt={item.product_title}
                      width="56"
                      height="56"
                      style={{ borderRadius: "8px", objectFit: "cover" as const }}
                    />
                  )}
                </Column>
                <Column style={{ paddingLeft: "12px", verticalAlign: "top" }}>
                  <Text style={{ fontSize: "14px", color: "#1A1A2E", margin: "0 0 2px" }}>
                    {item.product_title}
                  </Text>
                  {item.variant_title && (
                    <Text style={{ fontSize: "12px", color: "#999", margin: "0" }}>
                      {item.variant_title}
                    </Text>
                  )}
                  <Text style={{ fontSize: "12px", color: "#999", margin: "4px 0 0" }}>
                    Qty: {item.quantity}
                  </Text>
                </Column>
                <Column style={{ textAlign: "right" as const, verticalAlign: "top" }}>
                  <Text style={{ fontSize: "14px", color: "#1A1A2E", margin: "0" }}>
                    {formatPrice(item.total, curr)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={{ borderColor: "#EEEEEE", margin: "24px 0" }} />

            <Row>
              <Column>
                <Text style={{ fontSize: "14px", color: "#666" }}>{t.subtotal}</Text>
              </Column>
              <Column style={{ textAlign: "right" as const }}>
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  {formatPrice(order.subtotal, curr)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ fontSize: "14px", color: "#666" }}>{t.shipping}</Text>
              </Column>
              <Column style={{ textAlign: "right" as const }}>
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  {formatPrice(order.shipping_total, curr)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ fontSize: "14px", color: "#666" }}>{t.tax}</Text>
              </Column>
              <Column style={{ textAlign: "right" as const }}>
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  {formatPrice(order.tax_total, curr)}
                </Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: "#1A1A2E", margin: "12px 0" }} />
            <Row>
              <Column>
                <Text style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E" }}>
                  {t.total}
                </Text>
              </Column>
              <Column style={{ textAlign: "right" as const }}>
                <Text style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E" }}>
                  {formatPrice(order.total, curr)}
                </Text>
              </Column>
            </Row>

            {order.shipping_address && (
              <Section style={{ marginTop: "32px" }}>
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
              </Section>
            )}

            <Section style={{ textAlign: "center" as const, marginTop: "36px" }}>
              <NordHjemButton href="https://nordhjem.store/account/orders">
                {t.viewOrder}
              </NordHjemButton>
            </Section>
          </Section>

          <NordHjemFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  )
}
