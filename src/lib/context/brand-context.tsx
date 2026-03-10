"use client"

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

import { Brand, getBrandBySlug, getDefaultBrand } from "@/config/brands"

type BrandContextValue = {
  currentBrand: Brand
  switchBrand: (slug: string) => void
}

const STORAGE_KEY = "nordhjem-brand"

const BrandContext = createContext<BrandContextValue | null>(null)

const applyBrandCssVariables = (brand: Brand) => {
  if (typeof document === "undefined") return

  const root = document.documentElement
  root.style.setProperty("--brand-primary", brand.primaryColor)
  root.style.setProperty("--brand-secondary", brand.secondaryColor)
  root.style.setProperty("--brand-accent", brand.accentColor)
  root.style.setProperty("--brand-font", `'${brand.fontFamily}', sans-serif`)
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [currentBrand, setCurrentBrand] = useState<Brand>(() => getDefaultBrand())

  useEffect(() => {
    const savedSlug = window.localStorage.getItem(STORAGE_KEY)
    const initialBrand = getBrandBySlug(savedSlug)

    setCurrentBrand(initialBrand)
    applyBrandCssVariables(initialBrand)

    if (!savedSlug || savedSlug !== initialBrand.slug) {
      window.localStorage.setItem(STORAGE_KEY, initialBrand.slug)
    }
  }, [])

  const switchBrand = (slug: string) => {
    const nextBrand = getBrandBySlug(slug)

    setCurrentBrand(nextBrand)
    applyBrandCssVariables(nextBrand)
    window.localStorage.setItem(STORAGE_KEY, nextBrand.slug)
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
