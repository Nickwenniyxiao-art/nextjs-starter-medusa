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
    preview: "You left something behind at NordHjem",
    title: "Forgot something?",
    subtitle: "You left some beautiful pieces in your cart. They're still waiting for you.",
    items: "Your Cart",
    total: "Cart Total",
    returnToCart: "RETURN TO CART",
    expires: "Your cart will be saved for a limited time.",
  },
  zh: {
    preview: "您在 NordHjem 有未完成的购物",
    title: "忘了什么？",
    subtitle: "您的购物车中还有一些精美的商品等着您。",
    items: "购物车商品",
    total: "购物车总计",
    returnToCart: "返回购物车",
    expires: "您的购物车将保留一段时间。",
  },
}

type CartItem = {
  product_title: string
  variant_title?: string
  thumbnail?: string
  quantity: number
  total: number
}

type Props = {
  cart: {
    id: string
    email: string
    currency_code: string
    total: number
    items: CartItem[]
  }
  recoveryUrl: string
  locale?: string
}

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)

export function abandonedCartEmail({ cart, recoveryUrl, locale = "en" }: Props) {
  const t = locale === "zh" ? i18n.zh : i18n.en
  const curr = cart.currency_code || "usd"

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
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
                marginBottom: "32px",
              }}
            >
              {t.subtitle}
            </Text>

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

            {cart.items?.map((item, i) => (
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

            <Hr style={{ borderColor: "#1A1A2E", margin: "24px 0 12px" }} />
            <Row>
              <Column>
                <Text style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E" }}>
                  {t.total}
                </Text>
              </Column>
              <Column style={{ textAlign: "right" as const }}>
                <Text style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E" }}>
                  {formatPrice(cart.total, curr)}
                </Text>
              </Column>
            </Row>

            <Section style={{ textAlign: "center" as const, marginTop: "36px" }}>
              <NordHjemButton href={recoveryUrl}>{t.returnToCart}</NordHjemButton>
            </Section>

            <Text
              style={{
                fontSize: "12px",
                color: "#999",
                textAlign: "center" as const,
                marginTop: "24px",
              }}
            >
              {t.expires}
            </Text>
          </Section>

          <NordHjemFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  )
}
