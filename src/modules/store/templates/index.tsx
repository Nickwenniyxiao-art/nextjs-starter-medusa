import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getTranslations } from "next-intl/server"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({ sortBy, page, countryCode, minPrice, maxPrice, searchQuery }: { sortBy?: SortOptions; page?: string; countryCode: string; minPrice?: string; maxPrice?: string; searchQuery?: string }) => {
  const t = await getTranslations("store")
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "recommended"
  return <div className="flex flex-col small:flex-row small:items-start py-6 content-container bg-[#FAFAF8]" data-testid="category-container"><RefinementList sortBy={sort} /><div className="w-full"><div className="mb-8 text-2xl-semi text-[#2C3E2D] font-heading">{searchQuery ? <><h1 data-testid="store-page-title">{t("searchResultsFor", { query: searchQuery })}</h1><p className="text-sm text-[#2C3E2D]/50 font-normal mt-1">{t("searchResultsHint")}</p></> : <h1 data-testid="store-page-title">{t("allProducts")}</h1>}</div><Suspense fallback={<SkeletonProductGrid />}><PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} minPrice={minPrice} maxPrice={maxPrice} searchQuery={searchQuery} /></Suspense></div></div>
}

export default StoreTemplate
