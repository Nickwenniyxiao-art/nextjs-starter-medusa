import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NordHjemFooter } from "@/modules/resend/emails/components/Footer"

describe("NordHjemFooter", () => {
  it("renders english copy by default", () => {
    render(<NordHjemFooter />)

    expect(screen.getByText("Scandinavian living, thoughtfully curated.")).toBeInTheDocument()
    expect(screen.getByText("© NordHjem. All rights reserved.")).toBeInTheDocument()
  })

  it("renders chinese copy when locale is zh", () => {
    render(<NordHjemFooter locale="zh" />)

    expect(screen.getByText("甄选北欧生活美学。")).toBeInTheDocument()
    expect(screen.getByText("© NordHjem 版权所有。")).toBeInTheDocument()
  })
})
