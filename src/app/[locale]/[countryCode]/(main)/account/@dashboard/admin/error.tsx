"use client"

import { Button } from "@medusajs/ui"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 py-12">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-ui-fg-subtle">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
