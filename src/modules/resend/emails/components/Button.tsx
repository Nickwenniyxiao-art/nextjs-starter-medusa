import type { ReactNode } from "react"
import { Button } from "@react-email/components"

type Props = { href: string; children: ReactNode }

export function NordHjemButton({ href, children }: Props) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: "#1A1A2E",
        color: "#FFFFFF",
        padding: "14px 36px",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "1px",
        textDecoration: "none",
        textAlign: "center" as const,
      }}
    >
      {children}
    </Button>
  )
}
