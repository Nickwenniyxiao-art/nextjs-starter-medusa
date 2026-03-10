"use client"

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

import { Brand, getBrandBySlug, getDefaultBrand } from "@/config/brands"

type BrandContextValue = {
  currentBrand: Brand
  switchBrand: (slug: string) => void
}

const STORAGE_KEY = "nordhjem-brand"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const BrandContext = createContext<BrandContextValue | null>(null)

const applyBrandCssVariables = (brand: Brand) => {
  if (typeof document === "undefined") return

  const root = document.documentElement
  root.style.setProperty("--brand-primary", brand.primaryColor)
  root.style.setProperty("--brand-secondary", brand.secondaryColor)
  root.style.setProperty("--brand-accent", brand.accentColor)
  root.style.setProperty("--brand-font", `'${brand.fontFamily}', sans-serif`)
}

const persistBrandSlug = (slug: string) => {
  if (typeof window === "undefined") return

  window.localStorage.setItem(STORAGE_KEY, slug)
  document.cookie = `${STORAGE_KEY}=${slug}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

export function BrandProvider({
  children,
  brand,
}: {
  children: ReactNode
  brand?: Brand
}) {
  const [currentBrand, setCurrentBrand] = useState<Brand>(() => brand ?? getDefaultBrand())

  useEffect(() => {
    const savedSlug = window.localStorage.getItem(STORAGE_KEY)
    const initialBrand = getBrandBySlug(savedSlug ?? brand?.slug)

    setCurrentBrand(initialBrand)
    applyBrandCssVariables(initialBrand)

    if (!savedSlug || savedSlug !== initialBrand.slug) {
      persistBrandSlug(initialBrand.slug)
    }
  }, [brand?.slug])

  const switchBrand = (slug: string) => {
    const nextBrand = getBrandBySlug(slug)

    setCurrentBrand(nextBrand)
    applyBrandCssVariables(nextBrand)
    persistBrandSlug(nextBrand.slug)
  }

  const value = useMemo(
    () => ({
      currentBrand,
      switchBrand,
    }),
    [currentBrand]
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export function useBrand() {
  const context = useContext(BrandContext)

  if (!context) {
    throw new Error("useBrand must be used within BrandProvider")
  }

  return context
}
