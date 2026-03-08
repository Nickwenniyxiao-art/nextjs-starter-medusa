"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID

const CONSENT_KEY = "nordhjem_cookie_consent"

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return false
    const consent = JSON.parse(stored)
    return consent.analytics === true
  } catch {
    return false
  }
}

export function GA4Script() {
  const [consentGranted, setConsentGranted] = useState(false)

  useEffect(() => {
    setConsentGranted(hasAnalyticsConsent())

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) {
        setConsentGranted(hasAnalyticsConsent())
      }
    }

    const handleConsent = () => {
      setConsentGranted(hasAnalyticsConsent())
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("cookie-consent-update", handleConsent)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("cookie-consent-update", handleConsent)
    }
  }, [])

  if (!GA_MEASUREMENT_ID || !consentGranted) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}
