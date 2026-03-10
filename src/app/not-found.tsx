"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()

    if (!trimmed) {
      return
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl text-center space-y-6">
        <p className="text-7xl sm:text-8xl font-semibold tracking-tight">404</p>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-medium">
            页面未找到 / Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            抱歉，您访问的页面不存在。请输入关键词继续浏览。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-900 dark:border-gray-100 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900"
          >
            返回首页
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mx-auto w-full max-w-md">
          <label htmlFor="not-found-search" className="sr-only">
            搜索 / Search
          </label>
          <div className="flex items-center gap-2">
            <input
              id="not-found-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索商品 / Search products"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none ring-0 focus:border-gray-500"
            />
            <button
              type="submit"
              className="rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-85"
            >
              搜索
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
