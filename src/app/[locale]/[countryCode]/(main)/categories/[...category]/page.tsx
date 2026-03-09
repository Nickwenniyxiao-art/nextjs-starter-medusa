import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { getCategoryByHandle } from "@lib/data/categories"
import { generateBreadcrumbJsonLd, generateItemListJsonLd } from "@lib/util/structured-data"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const dynamic = "force-dynamic"
export const revalidate = 300 // 5 minutes
type Props = {
  params: Promise<{ category: string[]; countryCode: string; locale: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    min_price?: string
    max_price?: string
  }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale || "en"

  try {
    const productCategory = await getCategoryByHandle(params.category)

    const categoryName =
      locale === "zh" && productCategory.metadata?.zh_name
        ? String(productCategory.metadata.zh_name)
        : productCategory.name

    const title = `${categoryName} | NordHjem`

    const description =
      locale === "zh" && productCategory.metadata?.zh_description
        ? String(productCategory.metadata.zh_description)
        : productCategory.description ?? `${title} category.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
      alternates: {
        canonical: `https://nordhjem.store/categories/${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, min_price, max_price } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const locale = await getLocale()
  const categoryName =
    locale === "zh" && productCategory.metadata?.zh_name
      ? String(productCategory.metadata.zh_name)
      : productCategory.name

  const products = Array.isArray((productCategory as any).products) ? (productCategory as any).products : []
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: locale === "zh" ? "首页" : "Home", item: "https://nordhjem.store" },
    {
      name: categoryName,
      item: `https://nordhjem.store/categories/${params.category.join("/")}`,
    },
  ])
  const itemListJsonLd = generateItemListJsonLd(
    products.map((p: any) => ({ title: p.title || "", handle: p.handle || "" })),
    productCategory.name || ""
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        locale={locale}
        minPrice={min_price}
        maxPrice={max_price}
      />
    </>
  )
}
