import { getTranslations } from "next-intl/server"

export default async function TermsOfServicePage() {
  const t = await getTranslations("legal.terms")

  return (
    <main className="content-container py-16 md:py-24">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-forest/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-heading text-forest">{t("title")}</h1>
          <p className="text-sm text-forest/60">{t("lastUpdated")}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.acceptance.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.acceptance.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.usage.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.usage.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.liability.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.liability.body")}</p>
        </section>
      </article>
    </main>
  )
}
