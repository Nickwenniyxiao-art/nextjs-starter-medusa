"use client"

import { useState } from "react"
import { MagnifyingGlassMini } from "@medusajs/icons"
import SearchModal from "@modules/search/components/search-modal"
import { useTranslations } from "next-intl"

export default function SearchButton() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("nav")
  return <><button onClick={() => setIsOpen(true)} className="hover:text-brass transition-colors flex items-center gap-1.5" aria-label={t("search")} data-testid="nav-search-button"><MagnifyingGlassMini className="w-5 h-5" /><span className="hidden lg:inline text-sm">{t("search")}</span></button><SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} /></>
}
