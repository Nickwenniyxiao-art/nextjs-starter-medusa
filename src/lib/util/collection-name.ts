/**
 * Get localized collection name by handle.
 * Falls back to the original title from Medusa if no translation found.
 */
export function getLocalizedCollectionName(
  handle: string | undefined,
  title: string,
  t: (key: string) => string
): string {
  if (!handle) return title

  const localized = t(`names.${handle}`)

  // next-intl returns the key path if translation is missing
  if (localized === `names.${handle}` || localized.startsWith("collection.names.")) {
    return title
  }

  return localized
}
