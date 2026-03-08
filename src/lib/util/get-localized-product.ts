/**
 * Get localized product name.
 * In Chinese locale, reads product.metadata.name_zh with fallback to product.title.
 */
export function getLocalizedProductName(
  product: { title: string; metadata?: Record<string, any> | null },
  locale: string
): string {
  if (locale === "zh" && product.metadata?.name_zh) {
    return String(product.metadata.name_zh)
  }

  return product.title
}

/**
 * Get localized product description.
 * In Chinese locale, reads product.metadata.description_zh with fallback to product.description.
 */
export function getLocalizedProductDescription(
  product: {
    description?: string | null
    metadata?: Record<string, any> | null
  },
  locale: string
): string | null {
  if (locale === "zh" && product.metadata?.description_zh) {
    return String(product.metadata.description_zh)
  }

  return product.description ?? null
}

/**
 * Get localized variant color.
 * In Chinese locale, reads variant.metadata.color_zh with fallback to variant.title.
 */
export function getLocalizedVariantTitle(
  variant:
    | { title?: string | null; metadata?: Record<string, any> | null }
    | undefined
    | null,
  locale: string
): string {
  if (!variant) {
    return ""
  }

  if (locale === "zh" && variant.metadata?.color_zh) {
    return String(variant.metadata.color_zh)
  }

  return variant.title ?? ""
}

/**
 * Get localized collection name from metadata.
 * In Chinese locale, reads collection.metadata.zh_name with fallback to collection.title.
 */
export function getLocalizedCollectionTitle(
  collection: { title: string; metadata?: Record<string, any> | null },
  locale: string
): string {
  if (locale === "zh" && collection.metadata?.zh_name) {
    return String(collection.metadata.zh_name)
  }

  return collection.title
}
