"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { routing } from "@/i18n/routing"

const localeLabels: Record<string, string> = {
  en: "English",
  zh: "中文",
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value
    const segments = pathname.split("/")
    segments[1] = newLocale
    const newPath = segments.join("/")
    router.push(newPath)
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-transparent border border-forest/20 rounded-[8px] px-2 py-1 text-sm text-forest cursor-pointer hover:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
      aria-label="Select language"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeLabels[loc]}
        </option>
      ))}
    </select>
  )
}
