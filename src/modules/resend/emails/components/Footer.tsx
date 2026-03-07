import { Section, Text } from "@react-email/components"

const i18n = {
  en: {
    tagline: "Scandinavian living, thoughtfully curated.",
    copyright: "© NordHjem. All rights reserved.",
  },
  zh: {
    tagline: "甄选北欧生活美学。",
    copyright: "© NordHjem 版权所有。",
  },
}

type Props = {
  locale?: string
}

export function NordHjemFooter({ locale = "en" }: Props) {
  const t = locale === "zh" ? i18n.zh : i18n.en

  return (
    <Section
      style={{
        backgroundColor: "#F4F4F4",
        padding: "24px 40px",
        textAlign: "center" as const,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: "12px",
          margin: "0 0 8px",
        }}
      >
        {t.tagline}
      </Text>
      <Text
        style={{
          color: "#999999",
          fontSize: "11px",
          margin: "0",
        }}
      >
        {t.copyright}
      </Text>
    </Section>
  )
}
