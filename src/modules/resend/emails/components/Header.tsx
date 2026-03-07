import { Section, Text } from "@react-email/components"

export function NordHjemHeader() {
  return (
    <Section
      style={{
        backgroundColor: "#1A1A2E",
        padding: "24px 40px",
        textAlign: "center" as const,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: "20px",
          letterSpacing: "2px",
          fontWeight: 300,
          margin: "0",
        }}
      >
        NORDHJEM
      </Text>
    </Section>
  )
}
