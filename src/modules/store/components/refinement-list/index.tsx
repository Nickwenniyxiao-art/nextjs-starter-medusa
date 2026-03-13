"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import PriceFilter from "./price-filter"
import SortProducts, { SortOptions } from "./sort-products"

const COLOR_OPTIONS = [
  { value: "white", label: "White", labelZh: "白色", hex: "#FFFFFF" },
  { value: "black", label: "Black", labelZh: "黑色", hex: "#000000" },
  { value: "snow", label: "Snow", labelZh: "雪白色", hex: "#FFFAFA" },
  { value: "ivory", label: "Ivory", labelZh: "象牙白", hex: "#FFFFF0" },
  { value: "cream", label: "Cream", labelZh: "奶油色", hex: "#FFFDD0" },
  { value: "beige", label: "Beige", labelZh: "米色", hex: "#F5F5DC" },
  { value: "sand", label: "Sand", labelZh: "沙色", hex: "#C2B280" },
  { value: "oat", label: "Oat", labelZh: "燕麦色", hex: "#D4C5A9" },
  { value: "linen", label: "Linen", labelZh: "亚麻色", hex: "#E9DCC9" },
  { value: "caramel", label: "Caramel", labelZh: "焦糖色", hex: "#FFD59A" },
  { value: "brown", label: "Brown", labelZh: "棕色", hex: "#8B4513" },
  { value: "walnut", label: "Walnut", labelZh: "胡桃色", hex: "#5C4033" },
  { value: "teak", label: "Teak", labelZh: "柚木色", hex: "#B8860B" },
  { value: "oak", label: "Oak", labelZh: "橡木色", hex: "#C8AD7F" },
  { value: "pine", label: "Pine", labelZh: "松木色", hex: "#BDB76B" },
  { value: "dark gray", label: "Dark Gray", labelZh: "深灰色", hex: "#505050" },
  { value: "charcoal", label: "Charcoal", labelZh: "炭灰色", hex: "#36454F" },
  { value: "graphite", label: "Graphite", labelZh: "石墨色", hex: "#383838" },
  { value: "brass", label: "Brass", labelZh: "黄铜色", hex: "#B5A642" },
  { value: "pearl", label: "Pearl", labelZh: "珍珠色", hex: "#F0EAD6" },
  { value: "forest", label: "Forest", labelZh: "森林绿", hex: "#228B22" },
  { value: "sage", label: "Sage", labelZh: "鼠尾草绿", hex: "#BCB88A" },
  { value: "emerald", label: "Emerald", labelZh: "翡翠绿", hex: "#50C878" },
  { value: "navy", label: "Navy", labelZh: "海军蓝", hex: "#000080" },
]

const MATERIAL_OPTIONS = [
  { value: "wood", label: "Wood", labelZh: "木质" },
  { value: "oak", label: "Oak", labelZh: "橡木" },
  { value: "walnut", label: "Walnut", labelZh: "胡桃木" },
  { value: "ash", label: "Ash", labelZh: "白蜡木" },
  { value: "metal", label: "Metal", labelZh: "金属" },
  { value: "glass", label: "Glass", labelZh: "玻璃" },
  { value: "fabric", label: "Fabric", labelZh: "织物" },
  { value: "leather", label: "Leather", labelZh: "皮革" },
  { value: "stone", label: "Stone", labelZh: "石材" },
  { value: "ceramic", label: "Ceramic", labelZh: "陶瓷" },
]

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
}: {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}) => {
  const t = useTranslations("store")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isZh = pathname?.includes("/zh/") || false

  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set(name, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearQueryParam = (name: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.delete(name)
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleArrayParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    const current = params.get(name)?.split(",").filter(Boolean) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    if (updated.length) {
      params.set(name, updated.join(","))
    } else {
      params.delete(name)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const activeColors = searchParams?.get("colors")?.split(",").filter(Boolean) || []
  const activeMaterials =
    searchParams?.get("materials")?.split(",").filter(Boolean) || []

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
      <PriceFilter
        minPrice={searchParams?.get("min_price") || undefined}
        maxPrice={searchParams?.get("max_price") || undefined}
        setQueryParams={setQueryParams}
        clearQueryParam={clearQueryParam}
      />
      <div>
        <h3 className="text-sm font-semibold text-[#2C3E2D] mb-3">{t("filterColor")}</h3>
        <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => toggleArrayParam("colors", c.value)}
              className={`flex items-center gap-2 px-2 py-1 rounded text-sm text-left transition-colors ${
                activeColors.includes(c.value)
                  ? "bg-[#2C3E2D]/10 text-[#2C3E2D] font-medium"
                  : "text-gray-600 hover:text-[#2C3E2D]"
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <span>{isZh ? c.labelZh : c.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#2C3E2D] mb-3">{t("filterMaterial")}</h3>
        <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
          {MATERIAL_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => toggleArrayParam("materials", m.value)}
              className={`px-2 py-1 rounded text-sm text-left transition-colors ${
                activeMaterials.includes(m.value)
                  ? "bg-[#2C3E2D]/10 text-[#2C3E2D] font-medium"
                  : "text-gray-600 hover:text-[#2C3E2D]"
              }`}
            >
              {isZh ? m.labelZh : m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RefinementList
