import { PRODUCT_LIST_FIELDS } from "@lib/data/product-fields"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { sortProducts } from "@lib/util/sort-products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import EmptyResults from "@modules/store/components/empty-results"

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
  fields?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  minPrice,
  maxPrice,
  searchQuery,
  colors,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  minPrice?: string
  maxPrice?: string
  searchQuery?: string
  colors?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 100,
    fields: PRODUCT_LIST_FIELDS,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (searchQuery?.trim()) {
    queryParams["q"] = searchQuery.trim()
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProducts({
    pageParam: page,
    queryParams,
    countryCode,
  })

  // Client-side sort (Medusa v2 Store API does not support sort by calculated_price)
  if (sortBy && sortBy !== "recommended") {
    products = sortProducts(products, sortBy)
  }

  const minPriceNum = minPrice ? parseInt(minPrice) : undefined
  const maxPriceNum = maxPrice ? parseInt(maxPrice) : undefined

  if (minPriceNum !== undefined || maxPriceNum !== undefined) {
    products = products.filter((product) => {
      const price = product.variants?.[0]?.calculated_price?.calculated_amount
      if (price == null) return false
      if (minPriceNum !== undefined && price < minPriceNum) return false
      if (maxPriceNum !== undefined && price > maxPriceNum) return false
      return true
    })
  }

  if (colors) {
    const colorList = colors.split(",").map((c) => c.trim().toLowerCase())
    products = products.filter((product) => {
      const opts = product.options || []
      const colorOpt = opts.find((o: any) => o.title?.toLowerCase() === "color")
      if (!colorOpt) return false
      const vals = colorOpt.values?.map((v: any) => v.value?.toLowerCase()) || []
      return colorList.some((c) => vals.includes(c))
    })
  }

  count = products.length

  const ITEMS_PER_PAGE = 12
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  products = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

  if (products.length === 0) {
    return <EmptyResults query={searchQuery} />
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
