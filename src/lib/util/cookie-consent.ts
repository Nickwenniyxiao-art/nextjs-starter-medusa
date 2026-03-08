const CONSENT_KEY = "nordhjem_cookie_consent"

type ConsentState = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function getConsentState(): ConsentState | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(CONSENT_KEY)

  if (!stored) return null

  try {
    return JSON.parse(stored) as ConsentState
  } catch {
    return null
  }
}

export function hasAnalyticsConsent(): boolean {
  const consent = getConsentState()
  return consent?.analytics ?? false
}

export function hasMarketingConsent(): boolean {
  const consent = getConsentState()
  return consent?.marketing ?? false
}
