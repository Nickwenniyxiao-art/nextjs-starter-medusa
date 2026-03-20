import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NordHjemHeader } from "@/modules/resend/emails/components/Header"

describe("NordHjemHeader", () => {
  it("renders the brand name", () => {
    render(<NordHjemHeader />)

    expect(screen.getByText("NORDHJEM")).toBeInTheDocument()
  })

  it("renders the brand text only once", () => {
    render(<NordHjemHeader />)

    expect(screen.getAllByText("NORDHJEM")).toHaveLength(1)
  })
})
