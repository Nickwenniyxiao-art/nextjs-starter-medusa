"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    $crisp: unknown[]
    CRISP_WEBSITE_ID: string
    CRISP_RUNTIME_CONFIG?: {
      locale?: string
    }
  }
}

const ZH_WELCOME_MESSAGE = "你好！有任何关于北欧家具的问题，随时问我。"
const EN_WELCOME_MESSAGE =
  "Hi! Feel free to ask any questions about Nordic furniture."

const isChineseLocale = (locale: string) => locale.toLowerCase().startsWith("zh")

const detectLocale = (pathname: string) => {
  const localeFromPath = pathname.split("/").filter(Boolean)[0]

  if (localeFromPath) {
    return localeFromPath
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language
  }

  return "en"
}

const CrispChat = () => {
  const pathname = usePathname()

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    if (!websiteId) return

    const locale = detectLocale(pathname)
    const welcomeMessage = isChineseLocale(locale)
      ? ZH_WELCOME_MESSAGE
      : EN_WELCOME_MESSAGE

    window.$crisp = window.$crisp || []
    window.CRISP_WEBSITE_ID = websiteId
    window.CRISP_RUNTIME_CONFIG = {
      locale,
    }

    window.$crisp.push(["set", "session:data", [[["locale", locale]]]])
    window.$crisp.push([
      "set",
      "session:data",
      [[["welcome_message", welcomeMessage]]],
    ])

    const script = document.createElement("script")
    script.src = "https://client.crisp.chat/l.js"
    script.async = true

    const syncCustomerData = async () => {
      try {
        const response = await fetch("/store/customers/me", {
          credentials: "include",
        })

        if (!response.ok) return

        const data = (await response.json()) as {
          customer?: {
            email?: string
            first_name?: string
            last_name?: string
          }
        }

        const customer = data.customer
        if (!customer) return

        const nickname = [customer.first_name, customer.last_name]
          .filter(Boolean)
          .join(" ")

        if (customer.email) {
          window.$crisp.push(["set", "user:email", [customer.email]])
        }

        if (nickname) {
          window.$crisp.push(["set", "user:nickname", [nickname]])
        }
      } catch {
        // Ignore customer sync errors and allow Crisp to load normally.
      }
    }

    document.head.appendChild(script)
    syncCustomerData()

    return () => {
      script.remove()
    }
  }, [pathname])

  return null
}

export default CrispChat
