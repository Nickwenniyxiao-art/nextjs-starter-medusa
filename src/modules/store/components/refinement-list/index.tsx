"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import SortProducts, { SortOptions } from "./sort-products"
import PriceFilter from "./price-filter"

const COLOR_OPTIONS = [
  { value: "white", label: "White", labelZh: "白色", hex: "#FFFFFF" },
  { value: "black", label: "Black", labelZh: "黑色", hex: "#000000" },
  { value: "gray", label: "Gray", labelZh: "灰色", hex: "#808080" },
  { value: "beige", label: "Beige", labelZh: "米色", hex: "#F5F5DC" },
]
const MATERIAL_OPTIONS = [
  { value: "wood", label: "Wood", labelZh: "木材" },
  { value: "metal", label: "Metal", labelZh: "金属" },
  { value: "fabric", label: "Fabric", labelZh: "面料" },
]

const RefinementList = ({ sortBy, "data-testid": dataTestId }: { sortBy: SortOptions; search?: boolean; "data-testid"?: string }) => {
  const t = useTranslations("store")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isZh = pathname?.includes("/zh/") || false

  const setQueryParams = (name: string, value: string) => { const params = new URLSearchParams(searchParams?.toString()); params.set(name, value); router.push(`${pathname}?${params.toString()}`) }
  const clearQueryParam = (name: string) => { const params = new URLSearchParams(searchParams?.toString()); params.delete(name); router.push(`${pathname}?${params.toString()}`) }
  const toggleArrayParam = (name: string, value: string) => { const params = new URLSearchParams(searchParams?.toString()); const current = params.get(name)?.split(",").filter(Boolean) || []; const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]; updated.length ? params.set(name, updated.join(",")) : params.delete(name); router.push(`${pathname}?${params.toString()}`) }
  const activeColors = searchParams?.get("colors")?.split(",").filter(Boolean) || []
  const activeMaterials = searchParams?.get("materials")?.split(",").filter(Boolean) || []

  return <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]"><SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} /><PriceFilter minPrice={searchParams?.get("min_price") || undefined} maxPrice={searchParams?.get("max_price") || undefined} setQueryParams={setQueryParams} clearQueryParam={clearQueryParam} /><div><h3 className="text-sm font-semibold text-[#2C3E2D] mb-3">{t("filterColor")}</h3><div className="flex flex-wrap gap-2">{COLOR_OPTIONS.map((c)=><button key={c.value} onClick={() => toggleArrayParam("colors", c.value)} className={`w-7 h-7 rounded-full border-2 ${activeColors.includes(c.value)?"border-[#2C3E2D]":"border-gray-200"}`} style={{backgroundColor:c.hex}} title={isZh?c.labelZh:c.label} />)}</div></div><div><h3 className="text-sm font-semibold text-[#2C3E2D] mb-3">{t("filterMaterial")}</h3>{MATERIAL_OPTIONS.map((m)=><label key={m.value} className="flex items-center gap-2"><input type="checkbox" checked={activeMaterials.includes(m.value)} onChange={() => toggleArrayParam("materials", m.value)} /><span>{isZh?m.labelZh:m.label}</span></label>)}</div></div>
}

export default RefinementList
