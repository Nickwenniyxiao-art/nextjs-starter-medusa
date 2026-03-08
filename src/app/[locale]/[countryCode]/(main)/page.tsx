import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Categories from "@modules/home/components/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { generateWebSiteJsonLd } from "@lib/util/structured-data"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string; locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale || "en"
  const t = await getTranslations({ locale, namespace: "site" })

  const title = t("name") + " | " + t("tagline")
  const description = t("description")

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "https://nordhjem.store/opengraph-image.jpg" }],
    },
    alternates: {
      canonical: `https://nordhjem.store/${locale}/${params.countryCode}`,
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const t = await getTranslations("home")

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteJsonLd()) }}
      />
      <Hero />
      <Categories />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <section className="py-20 px-6 bg-white">
        <div className="content-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/brand-story.jpg"
                alt="NordHjem"
                className="rounded-lg w-full object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-[#2C3E2D] mb-6">
                {t("brandStory")}
              </h2>
              <p className="text-[#2C3E2D]/70 leading-relaxed mb-8">{t("brandStoryText")}</p>
              <LocalizedClientLink
                href="/about"
                className="inline-block border border-[#2C3E2D] text-[#2C3E2D] px-8 py-3 hover:bg-[#2C3E2D] hover:text-white transition-colors"
              >
                {t("brandStoryCta")}
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
