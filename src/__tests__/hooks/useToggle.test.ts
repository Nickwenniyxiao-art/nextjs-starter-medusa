import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import useToggleState from "@/lib/hooks/use-toggle-state"

describe("useToggleState", () => {
  it("starts with false by default and toggles state", () => {
    const { result } = renderHook(() => useToggleState())

    expect(result.current.state).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.state).toBe(true)
  })

  it("supports open and close helpers", () => {
    const { result } = renderHook(() => useToggleState(false))

    act(() => {
      result.current.open()
    })
    expect(result.current.state).toBe(true)

    act(() => {
      result.current.close()
    })
    expect(result.current.state).toBe(false)
  })
})
