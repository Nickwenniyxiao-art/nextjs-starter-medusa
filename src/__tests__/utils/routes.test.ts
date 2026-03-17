import { describe, expect, it } from "vitest"

import { routing } from "@/i18n/routing"

describe("routing", () => {
  it("includes the expected locales", () => {
    expect(routing.locales).toEqual(["en", "zh"])
  })

  it("uses english as default locale", () => {
    expect(routing.defaultLocale).toBe("en")
  })
})
