import { getTranslations } from "next-intl/server"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export async function generateMetadata() {
  const t = await getTranslations("site")

  return {
    title: t("name") + " — " + t("tagline"),
    description: t("description"),
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
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <div className="section-padding bg-warm">
        <div className="content-container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-heading text-forest mb-6">
            {t("brandStory")}
          </h2>
          <p className="text-forest/70 leading-relaxed mb-8">
            {t("brandStoryText")}
          </p>
          <LocalizedClientLink href="/about" className="btn-outline">
            {t("brandStoryCta")}
          </LocalizedClientLink>
        </div>
      </div>
    </>
  )
}
