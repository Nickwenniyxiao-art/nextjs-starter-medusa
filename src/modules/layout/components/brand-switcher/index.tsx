"use client"

import { useState } from "react"

import { brands } from "@/config/brands"
import { useBrand } from "@lib/context/brand-context"

const BrandSwitcher = () => {
  const { currentBrand, switchBrand } = useBrand()
  const [open, setOpen] = useState(false)

  if (brands.length <= 1) {
    return null
  }

  return (
    <div className="relative ml-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-secondary px-3 py-1.5 text-sm text-brand-primary transition hover:border-brand-accent"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
          {currentBrand.logo}
        </span>
        <span>{currentBrand.name}</span>
      </button>

      <div
        className={`absolute left-0 mt-2 min-w-52 overflow-hidden rounded-xl border border-brand-primary/10 bg-white shadow-lg transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => {
              switchBrand(brand.slug)
              setOpen(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-brand-primary transition hover:bg-brand-secondary"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
              {brand.logo}
            </span>
            <span>{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BrandSwitcher
