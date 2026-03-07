import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components"
import { NordHjemButton } from "./components/Button"
import { NordHjemFooter } from "./components/Footer"
import { NordHjemHeader } from "./components/Header"

const i18n = {
  en: {
    preview: "Reset your NordHjem password",
    title: "Password Reset",
    body: "We received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.",
    button: "RESET PASSWORD",
    ignore: "If you didn't request this, you can safely ignore this email.",
  },
  zh: {
    preview: "重置您的 NordHjem 密码",
    title: "密码重置",
    body: "我们收到了您的密码重置请求。点击下方按钮设置新密码。此链接将在 1 小时后失效。",
    button: "重置密码",
    ignore: "如果您没有发起此请求，请忽略此邮件。",
  },
}

type Props = { email: string; resetUrl: string; locale?: string }

export function passwordResetEmail({ email, resetUrl, locale = "en" }: Props) {
  const t = locale === "zh" ? i18n.zh : i18n.en

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body
        style={{
          backgroundColor: "#FAFAFA",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          <NordHjemHeader />
          <Section
            style={{
              backgroundColor: "#FFFFFF",
              padding: "48px 40px",
              textAlign: "center" as const,
            }}
          >
            <Text
              style={{
                fontSize: "22px",
                fontWeight: 300,
                color: "#1A1A2E",
                letterSpacing: "1px",
              }}
            >
              {t.title}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: "24px",
                margin: "16px 0 32px",
              }}
            >
              {t.body}
            </Text>
            <NordHjemButton href={resetUrl}>{t.button}</NordHjemButton>
            <Text
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "32px",
              }}
            >
              {t.ignore}
            </Text>
            <Text style={{ fontSize: "11px", color: "#BBBBBB", marginTop: "8px" }}>
              {email}
            </Text>
          </Section>
          <NordHjemFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  )
}
