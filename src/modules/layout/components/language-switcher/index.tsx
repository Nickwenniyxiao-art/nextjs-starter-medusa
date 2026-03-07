"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

const localeLabel: Record<string, string> = {
  en: "EN",
  zh: "中文",
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const nextLocale = locale === "zh" ? "en" : "zh"

  const handleSwitch = () => {
    const segments = pathname.split("/")
    segments[1] = nextLocale
    router.push(segments.join("/"))
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="hover:text-brass transition-colors"
      aria-label={`Switch language to ${localeLabel[nextLocale]}`}
      data-testid="nav-language-switcher"
    >
      {localeLabel[locale] ?? locale.toUpperCase()}
    </button>
  )
}
