import { getTranslations } from "next-intl/server"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Categories from "@modules/home/components/categories"
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
