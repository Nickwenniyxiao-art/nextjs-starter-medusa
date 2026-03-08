"use client"

import { useEffect, useRef } from "react"
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

/**
 * Extract countryCode from URL pathname.
 * Route structure: /[locale]/[countryCode]/...
 * Examples:
 *   /en/us/products → "en"  (locale segment, used for Crisp locale)
 *   /zh/cn/products → "zh"
 *   /en/us          → "en"
 * We use the FIRST segment (locale) for Crisp language.
 */
const detectLocale = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean)
  // segments[0] = locale (en | zh), segments[1] = countryCode (us | cn)
  if (segments[0]) {
    return segments[0]
  }
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language.startsWith("zh") ? "zh" : "en"
  }
  return "en"
}

const CrispChat = () => {
  const pathname = usePathname()
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    if (!websiteId) return

    const locale = detectLocale(pathname)

    // Initialize Crisp globals
    window.$crisp = window.$crisp || []
    window.CRISP_WEBSITE_ID = websiteId
    window.CRISP_RUNTIME_CONFIG = {
      locale: locale.startsWith("zh") ? "zh" : "en",
    }

    // Set session data: locale
    window.$crisp.push(["set", "session:data", [[["locale", locale]]]])

    // Load script only once
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script")
      script.src = "https://client.crisp.chat/l.js"
      script.async = true
      document.head.appendChild(script)
      scriptLoadedRef.current = true
    }

    // Sync customer identity
    syncCustomerIdentity()
  }, [pathname])

  return null
}

/**
 * Fetch current logged-in customer and sync identity to Crisp.
 * If not logged in (401), do nothing — anonymous session remains.
 */
async function syncCustomerIdentity() {
  try {
    const response = await fetch("/store/customers/me", {
      credentials: "include",
    })

    if (!response.ok) return

    const data = (await response.json()) as {
      customer?: {
        id?: string
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

    // Sync medusa_customer_id to session data
    if (customer.id) {
      window.$crisp.push([
        "set",
        "session:data",
        [[["medusa_customer_id", customer.id]]],
      ])
    }
  } catch {
    // Ignore errors — Crisp works fine for anonymous users
  }
}

/**
 * Reset Crisp session. Call this BEFORE server-side signout.
 * Exported so account-nav can call it on logout.
 */
export function resetCrispSession() {
  try {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "session:reset"])
    }
  } catch {
    // Ignore — best effort
  }
}

export default CrispChat
