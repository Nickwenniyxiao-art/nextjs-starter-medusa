import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { getBaseURL } from "@lib/util/env"

type BreadcrumbItem = {
  name: string
  item: string
}

const BRAND_NAME = "NordHjem"

export function generateProductJsonLd(product: HttpTypes.StoreProduct) {
  const { cheapestPrice } = getProductPrice({ product })

  const imageUrls =
    product.images
      ?.map((image) => image.url)
      .filter((url): url is string => Boolean(url)) ?? []

  if (product.thumbnail) {
    imageUrls.unshift(product.thumbnail)
  }

  const uniqueImageUrls = [...new Set(imageUrls)]

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.subtitle || product.title,
    image: uniqueImageUrls,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      price: cheapestPrice?.calculated_price_number,
      priceCurrency: cheapestPrice?.currency_code?.toUpperCase(),
      availability:
        product.variants?.some((variant) => {
          if (!variant.manage_inventory || variant.allow_backorder) {
            return true
          }

          return (variant.inventory_quantity || 0) > 0
        })
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${getBaseURL()}/products/${product.handle}`,
    },
  }
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: "https://nordhjem.store",
  }
}
