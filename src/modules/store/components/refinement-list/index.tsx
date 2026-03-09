"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import SortProducts, { SortOptions } from "./sort-products"
import PriceFilter from "./price-filter"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({ sortBy, "data-testid": dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      <PriceFilter
        minPrice={searchParams?.get("min_price") || undefined}
        maxPrice={searchParams?.get("max_price") || undefined}
        setQueryParams={setQueryParams}
        clearQueryParam={clearQueryParam}
      />
    </div>
  )
}

export default RefinementList
