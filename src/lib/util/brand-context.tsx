"use client"

import { createContext, ReactNode, useContext } from "react"
import { BrandConfig, getBrandConfig } from "@/config/brands"

const BrandContext = createContext<BrandConfig | null>(null)

export function BrandProvider({
  brand,
  children,
}: {
  brand: BrandConfig
  children: ReactNode
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export function useBrand(): BrandConfig {
  const ctx = useContext(BrandContext)

  if (!ctx) {
    return getBrandConfig()
  }

  return ctx
}
