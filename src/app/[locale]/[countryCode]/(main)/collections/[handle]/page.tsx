import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle } from "@lib/data/collections"
import { getLocalizedCollectionTitle } from "@lib/util/get-localized-product"
import { generateBreadcrumbJsonLd } from "@lib/util/structured-data"
import { StoreCollection } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"

export const dynamic = "force-dynamic"
export const revalidate = 300 // 5 minutes
type Props = {
  params: Promise<{ handle: string; countryCode: string; locale: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = await getLocale()
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const collectionName = getLocalizedCollectionTitle(collection, locale)
  const description =
    locale === "zh" ? `${collectionName}系列` : `${collectionName} collection`

  return {
    title: `${collectionName} | NordHjem`,
    description,
    openGraph: {
      title: `${collectionName} | NordHjem`,
      description,
    },
    alternates: {
      canonical: `https://nordhjem.store/collections/${params.handle}`,
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams
  const locale = await getLocale()

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  const collectionName = getLocalizedCollectionTitle(collection, locale)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: locale === "zh" ? "首页" : "Home", item: "https://nordhjem.store" },
    {
      name: collectionName,
      item: `https://nordhjem.store/collections/${params.handle}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </>
  )
}
