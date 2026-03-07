import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"
import { getTranslations } from "next-intl/server"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const t = await getTranslations("product")
  const region = await getRegion(countryCode)

  if (!region || !product.collection_id) {
    return null
  }

  const products = await listProducts({
    queryParams: {
      collection_id: [product.collection_id],
      is_giftcard: false,
      limit: 5,
    },
    countryCode,
  }).then(({ response }) =>
    response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .slice(0, 4)
  )

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <h2 className="text-2xl-regular text-ui-fg-base mb-8 text-center">
        {t("relatedProductsHeading")}
      </h2>

      <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <ProductPreview region={region} product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}
