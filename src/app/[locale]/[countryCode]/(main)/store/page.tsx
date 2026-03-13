import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    min_price?: string
    max_price?: string
    q?: string
    colors?: string
    materials?: string
  }>
  params: Promise<{ countryCode: string; locale: string }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: "store" })

  return {
    title: `${t("allProducts")} | NordHjem`,
    description: t("allProducts"),
  }
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, min_price, max_price, q, colors, materials } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      minPrice={min_price}
      maxPrice={max_price}
      searchQuery={q}
      colors={colors}
      materials={materials}
    />
  )
}
