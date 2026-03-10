"use client"

import Link from "next/link"
import { Component, ErrorInfo, ReactNode } from "react"

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[50vh] bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              出了点问题 / Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              请刷新页面重试 / Please refresh and try again
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleRefresh}
                className="rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-2.5 text-sm font-medium hover:opacity-90"
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
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
