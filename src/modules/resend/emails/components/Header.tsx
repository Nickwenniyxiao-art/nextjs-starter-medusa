import { Section, Text } from "@react-email/components"

export function NordHjemHeader() {
  return (
    <Section
      style={{
        backgroundColor: "#1A1A2E",
        padding: "28px 32px",
        textAlign: "center" as const,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: "26px",
          fontWeight: 300,
          letterSpacing: "6px",
          margin: "0",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        NORDHJEM
      </Text>
    </Section>
  )
}
