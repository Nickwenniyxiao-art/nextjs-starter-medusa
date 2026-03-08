import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | NordHjem",
  description: "Discover the story behind NordHjem — Nordic minimalist home furnishing, powered by AI.",
}

export default async function AboutPage() {
  const t = await getTranslations("about")

  return (
    <main className="content-container py-16 md:py-24">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-forest/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-heading text-forest">{t("title")}</h1>
          <p className="text-sm text-forest/60">{t("subtitle")}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.story.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.story.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.mission.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.mission.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.ai.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.ai.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.values.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.values.body")}</p>
        </section>
      </article>
    </main>
  )
}
