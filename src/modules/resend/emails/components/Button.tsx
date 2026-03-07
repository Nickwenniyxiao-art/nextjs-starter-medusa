import { Button } from "@react-email/components"
import type { CSSProperties, ReactNode } from "react"

type Props = {
  href: string
  children: ReactNode
  style?: CSSProperties
}

export function NordHjemButton({ href, children, style }: Props) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: "#1A1A2E",
        color: "#FFFFFF",
        fontSize: "12px",
        letterSpacing: "1.5px",
        fontWeight: 600,
        textDecoration: "none",
        borderRadius: "0px",
        padding: "14px 28px",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </Button>
  )
}
