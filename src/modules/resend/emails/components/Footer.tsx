import { Hr, Link, Section, Text } from "@react-email/components"

const t = {
  en: {
    support: "Questions? Contact us at",
    email: "support@nordhjem.store",
    copyright: "© 2026 NordHjem. All rights reserved.",
  },
  zh: {
    support: "有问题？联系我们",
    email: "support@nordhjem.store",
    copyright: "© 2026 NordHjem 版权所有",
  },
}

export function NordHjemFooter({ locale = "en" }: { locale?: string }) {
  const text = locale === "zh" ? t.zh : t.en

  return (
    <Section
      style={{
        backgroundColor: "#F5F5F5",
        padding: "32px",
        textAlign: "center" as const,
      }}
    >
      <Hr style={{ borderColor: "#E0E0E0", margin: "0 0 20px" }} />
      <Text style={{ color: "#888", fontSize: "13px", lineHeight: "20px" }}>
        {text.support}{" "}
        <Link href="mailto:support@nordhjem.store" style={{ color: "#1A1A2E" }}>
          {text.email}
        </Link>
      </Text>
      <Text style={{ color: "#BBB", fontSize: "12px", marginTop: "12px" }}>
        {text.copyright}
      </Text>
    </Section>
  )
}
