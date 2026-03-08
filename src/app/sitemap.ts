import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import { routing } from "@/i18n/routing"
import { MetadataRoute } from "next"

/**
 * Active market country codes for sitemap generation.
 * Only these countries get product/category/collection/static URLs in sitemap.
 * This prevents sitemap bloat from Medusa's ~250 registered countries.
 */
const ACTIVE_COUNTRIES = [
  "us",
  "ca",
  "gb",
  "de",
  "fr",
  "it",
  "nl",
  "no",
  "dk",
  "fi",
  "es",
  "au",
] as const

const CATEGORY_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "weekly"
const COLLECTION_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "weekly"
const PRODUCT_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "weekly"
const HOME_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "daily"
const STATIC_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "monthly"

async function getAllProducts(
  countryCode: string
): Promise<Array<{ handle: string }>> {
  const allProducts: Array<{ handle: string }> = []
  let page = 1
  const limit = 100

  while (true) {
    const { response } = await listProducts({
      pageParam: page,
      countryCode,
      queryParams: {
        limit,
        fields: "handle",
      },
    })

    allProducts.push(...response.products)

    if (response.products.length < limit) {
      break
    }
    page++
  }

  return allProducts
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const [regions, categories, { collections }] = await Promise.all([
    listRegions(),
    listCategories(),
    listCollections(),
  ])

  const allCountryCodes = Array.from(
    new Set(
      (regions ?? [])
        .flatMap((region) => region.countries ?? [])
        .map((country) => country.iso_2?.toLowerCase())
        .filter((iso2): iso2 is string => Boolean(iso2))
    )
  )

  // Filter to active markets only to keep sitemap under Google's 50,000 URL limit
  const countryCodes = allCountryCodes.filter((code) =>
    ACTIVE_COUNTRIES.includes(code as (typeof ACTIVE_COUNTRIES)[number])
  )

  const localeCountryPairs = routing.locales.flatMap((locale) =>
    countryCodes.map((countryCode) => ({ locale, countryCode }))
  )

  const homeEntries: MetadataRoute.Sitemap = localeCountryPairs.map(
    ({ locale, countryCode }) => ({
      url: `${baseUrl}/${locale}/${countryCode}`,
      changeFrequency: HOME_CHANGE_FREQUENCY,
      priority: 1,
    })
  )

  const primaryCountryCode = countryCodes[0] || "us"
  const allProducts = await getAllProducts(primaryCountryCode)
  const uniqueHandles = Array.from(
    new Set(allProducts.map((p) => p.handle).filter(Boolean))
  )

  const productEntries: MetadataRoute.Sitemap = uniqueHandles.flatMap(
    (handle) =>
      localeCountryPairs.map(({ locale, countryCode }) => ({
        url: `${baseUrl}/${locale}/${countryCode}/products/${handle}`,
        changeFrequency: PRODUCT_CHANGE_FREQUENCY,
        priority: 0.8,
      }))
  )

  const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).flatMap(
    (category) =>
      localeCountryPairs.map(({ locale, countryCode }) => ({
        url: `${baseUrl}/${locale}/${countryCode}/categories/${category.handle}`,
        changeFrequency: CATEGORY_CHANGE_FREQUENCY,
        priority: 0.8,
      }))
  )

  const collectionEntries: MetadataRoute.Sitemap = (collections ?? []).flatMap(
    (collection) =>
      localeCountryPairs.map(({ locale, countryCode }) => ({
        url: `${baseUrl}/${locale}/${countryCode}/collections/${collection.handle}`,
        changeFrequency: COLLECTION_CHANGE_FREQUENCY,
        priority: 0.7,
      }))
  )

  const staticPages = [
    "store",
    "about",
    "track-order",
    "privacy-policy",
    "terms-of-service",
    "refund-policy",
    "shipping-policy",
    "cookie-policy",
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    localeCountryPairs.map(({ locale, countryCode }) => ({
      url: `${baseUrl}/${locale}/${countryCode}/${page}`,
      changeFrequency: STATIC_CHANGE_FREQUENCY,
      priority: 0.5,
    }))
  )

  return [
    ...homeEntries,
    ...productEntries,
    ...categoryEntries,
    ...collectionEntries,
    ...staticEntries,
  ]
}
