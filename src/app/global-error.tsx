"use client"

import { sentry } from "@lib/sentry"
import Link from "next/link"
import { useEffect } from "react"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-12">
        <main className="w-full max-w-xl text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            出了点问题 / Something went wrong
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            请刷新页面重试 / Please refresh and try again
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={reset}
              className="rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-2.5 text-sm font-medium hover:opacity-90"
            >
              重新尝试
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md border border-gray-900 dark:border-gray-100 px-5 py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900"
            >
              刷新页面
            </button>
            <Link
              href="/"
              className="rounded-md border border-gray-900 dark:border-gray-100 px-5 py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900"
            >
              返回首页
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
