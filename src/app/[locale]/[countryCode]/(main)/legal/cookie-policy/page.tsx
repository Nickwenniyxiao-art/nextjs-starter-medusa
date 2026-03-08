import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | NordHjem",
  description: "Learn about how NordHjem uses cookies.",
}

export default async function CookiePolicyPage() {
  const t = await getTranslations("legal.cookie")

  return (
    <main className="content-container py-16 md:py-24">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-forest/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-heading text-forest">{t("title")}</h1>
          <p className="text-sm text-forest/60">{t("lastUpdated")}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.whatAreCookies.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.whatAreCookies.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.howWeUse.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.howWeUse.body")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forest">{t("sections.manage.title")}</h2>
          <p className="leading-7 text-forest/80">{t("sections.manage.body")}</p>
        </section>
      </article>
    </main>
  )
}
