import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import {
  generateBreadcrumbJsonLd,
  generateProductJsonLd,
} from "@lib/util/structured-data"
import { HttpTypes } from "@medusajs/types"
import RelatedProducts from "@modules/products/components/related-products"
import RecentlyViewed from "@modules/products/components/recently-viewed"

export const dynamic = "force-dynamic"
export const revalidate = 300 // 5 minutes

type Props = {
  params: Promise<{ countryCode: string; handle: string; locale: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  return []
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  const matchedImages = product.images?.filter((i) => imageIdsMap.has(i.id)) || []

  if (matchedImages.length) {
    return matchedImages
  }

  return variant.images
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const locale = params.locale || "en"
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const title =
    locale === "zh" && product.metadata?.name_zh
      ? String(product.metadata.name_zh)
      : product.title
  const description =
    locale === "zh" && product.metadata?.description_zh
      ? String(product.metadata.description_zh)
      : product.description || product.title

  const ogDescription = description.slice(0, 160)

  return {
    title: `${title} | NordHjem`,
    description,
    openGraph: {
      title: `${title} | NordHjem`,
      description: ogDescription,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
    alternates: {
      canonical: `https://nordhjem.store/products/${handle}`,
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const locale = params.locale || "en"
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId) ?? []

  if (!pricedProduct) {
    notFound()
  }

  const productJsonLd = generateProductJsonLd(pricedProduct)
  const title =
    locale === "zh" && pricedProduct.metadata?.name_zh
      ? String(pricedProduct.metadata.name_zh)
      : pricedProduct.title
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    {
      name: locale === "zh" ? "首页" : "Home",
      item: "https://nordhjem.store",
    },
    {
      name: locale === "zh" ? "所有商品" : "Products",
      item: "https://nordhjem.store/products",
    },
    {
      name: title,
      item: `https://nordhjem.store/products/${pricedProduct.handle}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
      <RelatedProducts
        product={pricedProduct}
        countryCode={params.countryCode}
      />
      <RecentlyViewed
        handle={pricedProduct.handle}
        countryCode={params.countryCode}
      />
    </>
  )
}
