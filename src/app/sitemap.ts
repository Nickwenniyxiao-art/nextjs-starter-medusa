import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import { routing } from "@/i18n/routing"
import { MetadataRoute } from "next"

const CATEGORY_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "weekly"
const COLLECTION_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "weekly"
const HOME_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "daily"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const [regions, categories, { collections }] = await Promise.all([
    listRegions(),
    listCategories(),
    listCollections(),
  ])

  const countryCodes = Array.from(
    new Set(
      (regions ?? [])
        .flatMap((region) => region.countries ?? [])
        .map((country) => country.iso_2)
        .filter((iso2): iso2 is string => Boolean(iso2))
    )
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

  return [...homeEntries, ...categoryEntries, ...collectionEntries]
}
