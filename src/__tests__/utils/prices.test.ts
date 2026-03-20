import { describe, expect, it } from "vitest"

import { convertToLocale } from "@/lib/util/money"

describe("convertToLocale", () => {
  it("formats a valid amount as currency", () => {
    const formatted = convertToLocale({ amount: 1234.56, currency_code: "USD", locale: "en-US" })

    expect(formatted).toBe("$1,234.56")
  })

  it("returns a placeholder when amount is invalid", () => {
    const formatted = convertToLocale({ amount: null, currency_code: "USD" })

    expect(formatted).toBe("—")
  })
})
