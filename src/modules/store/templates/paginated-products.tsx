import { PRODUCT_LIST_FIELDS } from "@lib/data/product-fields"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
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
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
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

  if (sortBy === "created_at") {
    queryParams["order"] = "-created_at"
  }

  if (sortBy === "price_asc") {
    queryParams["order"] = "variants.calculated_price"
  }

  if (sortBy === "price_desc") {
    queryParams["order"] = "-variants.calculated_price"
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

  const totalPages = Math.ceil(count / 12)

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
