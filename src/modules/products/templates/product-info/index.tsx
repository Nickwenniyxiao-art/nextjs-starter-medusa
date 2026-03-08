import { getLocalizedCollectionName } from "@lib/util/collection-name"
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
} from "@lib/util/get-localized-product"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale, getTranslations } from "next-intl/server"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = async ({ product }: ProductInfoProps) => {
  const [tCollection, locale] = await Promise.all([
    getTranslations("collection"),
    getLocale(),
  ])

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {getLocalizedCollectionName(
              product.collection.handle,
              product.collection.title,
              tCollection
            )}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-[#2C3E2D]"
          data-testid="product-title"
        >
          {getLocalizedProductName(product, locale)}
        </Heading>

        <Text
          className="text-medium text-[#2C3E2D]/70 whitespace-pre-line"
          data-testid="product-description"
        >
          {getLocalizedProductDescription(product, locale)}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
