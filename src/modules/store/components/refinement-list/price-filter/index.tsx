"use client"

import { FormEvent } from "react"
import { useTranslations } from "next-intl"

export type PriceRange = {
  min?: number
  max?: number
}

type PriceFilterProps = {
  minPrice?: string
  maxPrice?: string
  setQueryParams: (name: string, value: string) => void
  clearQueryParam: (name: string) => void
}

const PRESET_RANGES = [
  { min: 0, max: 500, labelKey: "priceRange0to500" },
  { min: 500, max: 1000, labelKey: "priceRange500to1000" },
  { min: 1000, max: 2000, labelKey: "priceRange1000to2000" },
  { min: 2000, max: 5000, labelKey: "priceRange2000to5000" },
  { min: 5000, max: undefined, labelKey: "priceRange5000plus" },
] as const

const PriceFilter = ({
  minPrice,
  maxPrice,
  setQueryParams,
  clearQueryParam,
}: PriceFilterProps) => {
  const t = useTranslations("store")

  const isActive = (min: number, max: number | undefined) => {
    const currentMin = minPrice ? parseInt(minPrice) : undefined
    const currentMax = maxPrice ? parseInt(maxPrice) : undefined
    return currentMin === min && currentMax === max
  }

  const handlePresetClick = (min: number, max: number | undefined) => {
    if (isActive(min, max)) {
      clearQueryParam("min_price")
      clearQueryParam("max_price")
      return
    }
    setQueryParams("min_price", String(min))
    if (max !== undefined) {
      setQueryParams("max_price", String(max))
    } else {
      clearQueryParam("max_price")
    }
  }

  const handleCustomSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    let min = formData.get("custom_min") as string
    let max = formData.get("custom_max") as string

    if (min && max && parseInt(min) > parseInt(max)) {
      const temp = min
      min = max
      max = temp
    }

    if (min) {
      setQueryParams("min_price", min)
    } else {
      clearQueryParam("min_price")
    }
    if (max) {
      setQueryParams("max_price", max)
    } else {
      clearQueryParam("max_price")
    }
  }

  const handleClear = () => {
    clearQueryParam("min_price")
    clearQueryParam("max_price")
  }

  const hasActiveFilter = minPrice || maxPrice

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-base-semi text-[#2C3E2D]">{t("priceRange")}</span>

      <div className="flex flex-col gap-y-2">
        {PRESET_RANGES.map((range) => (
          <button
            key={range.labelKey}
            onClick={() => handlePresetClick(range.min, range.max)}
            className={`text-left text-sm px-3 py-1.5 rounded border transition-colors ${
              isActive(range.min, range.max)
                ? "border-[#2C3E2D] bg-[#2C3E2D] text-white"
                : "border-gray-200 hover:border-[#2C3E2D] text-gray-700"
            }`}
          >
            {t(range.labelKey)}
          </button>
        ))}
      </div>

      <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 mt-2">
        <input
          type="number"
          name="custom_min"
          placeholder={t("min")}
          defaultValue={minPrice || ""}
          min={0}
          className="w-20 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#2C3E2D]"
        />
        <span className="text-gray-400">—</span>
        <input
          type="number"
          name="custom_max"
          placeholder={t("max")}
          defaultValue={maxPrice || ""}
          min={0}
          className="w-20 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#2C3E2D]"
        />
        <button
          type="submit"
          className="text-sm px-2 py-1 bg-[#2C3E2D] text-white rounded hover:bg-[#1a2a1b] transition-colors"
        >
          {t("apply")}
        </button>
      </form>

      {hasActiveFilter && (
        <button
          onClick={handleClear}
          className="text-sm text-[#2C3E2D] underline text-left"
        >
          {t("clearFilter")}
        </button>
      )}
    </div>
  )
}

export default PriceFilter
