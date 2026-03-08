"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CONSENT_KEY = "nordhjem_cookie_consent"

type ConsentState = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)

    if (!stored) {
      setVisible(true)
      return
    }

    try {
      JSON.parse(stored)
    } catch {
      localStorage.removeItem(CONSENT_KEY)
      setVisible(true)
    }
  }, [])

  const acceptAll = () => {
    const fullConsent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
    }

    localStorage.setItem(CONSENT_KEY, JSON.stringify(fullConsent))
    window.dispatchEvent(new Event("cookie-consent-update"))
    setVisible(false)
  }

  const savePreferences = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    window.dispatchEvent(new Event("cookie-consent-update"))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-lg bg-[#2C3E2D]/95 p-6 text-[#FAFAF8] shadow-xl backdrop-blur-sm">
        {!showPreferences ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex-1 text-sm leading-relaxed">
              We use cookies to enhance your experience. By continuing, you agree to our{" "}
              <LocalizedClientLink
                href="/legal/cookie-policy"
                className="underline transition-colors hover:text-[#C4A35A]"
              >
                Cookie Policy
              </LocalizedClientLink>
              .
            </p>
            <div className="shrink-0 flex gap-3">
              <button
                onClick={() => setShowPreferences(true)}
                className="rounded border border-[#FAFAF8]/30 px-4 py-2 text-sm transition-colors hover:bg-[#FAFAF8]/10"
              >
                Manage Preferences
              </button>
              <button
                onClick={acceptAll}
                className="rounded bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-[#2C3E2D] transition-colors hover:bg-[#FAFAF8]/90"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-base font-medium">Cookie Preferences</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Necessary Cookies</span>
                  <p className="text-xs text-[#FAFAF8]/60">
                    Required for the website to function. Always enabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="h-4 w-4 accent-[#C4A35A]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Analytics Cookies</span>
                  <p className="text-xs text-[#FAFAF8]/60">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent((prev) => ({
                      ...prev,
                      analytics: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#C4A35A]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Marketing Cookies</span>
                  <p className="text-xs text-[#FAFAF8]/60">
                    Used to deliver personalized advertisements.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent((prev) => ({
                      ...prev,
                      marketing: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#C4A35A]"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPreferences(false)}
                className="rounded border border-[#FAFAF8]/30 px-4 py-2 text-sm transition-colors hover:bg-[#FAFAF8]/10"
              >
                Back
              </button>
              <button
                onClick={savePreferences}
                className="rounded bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-[#2C3E2D] transition-colors hover:bg-[#FAFAF8]/90"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
