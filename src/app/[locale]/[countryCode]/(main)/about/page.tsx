import { getLocale, getTranslations } from "next-intl/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | NordHjem",
  description:
    "Discover the story behind NordHjem — Nordic minimalist home furnishing, designed with simplicity and warmth.",
}

const TEAM_MEMBERS = [
  {
    name: "Erik Larsson",
    nameZh: "Erik Larsson",
    role: "Founder & CEO",
    roleZh: "创始人兼首席执行官",
  },
  {
    name: "Ingrid Holm",
    nameZh: "Ingrid Holm",
    role: "Head of Design",
    roleZh: "设计总监",
  },
  {
    name: "Nils Andersen",
    nameZh: "Nils Andersen",
    role: "Head of Sustainability",
    roleZh: "可持续发展总监",
  },
]

const BRAND_VALUES = [
  { icon: "🌿", key: "sustainability" },
  { icon: "✨", key: "simplicity" },
  { icon: "🏠", key: "warmth" },
  { icon: "🎯", key: "quality" },
]

export default async function AboutPage() {
  const [t, locale] = await Promise.all([getTranslations("about"), getLocale()])
  const isZh = locale.startsWith("zh")

  return (
    <main className="bg-[#FAFAF8]">
      <section className="relative flex min-h-[40vh] items-center justify-center text-center">
        <div className="absolute inset-0 bg-[#2C3E2D]" />
        <div className="relative z-10 px-6 py-16">
          <h1 className="mb-4 text-4xl font-heading text-white md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/70">{t("subtitle")}</p>
        </div>
      </section>

      <div className="content-container py-16">
        <section className="mb-16 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-heading text-[#2C3E2D]">
              {t("sections.story.title")}
            </h2>
            <p className="text-[#2C3E2D]/70">{t("sections.story.body")}</p>
          </article>
          <article className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-heading text-[#2C3E2D]">
              {t("sections.mission.title")}
            </h2>
            <p className="text-[#2C3E2D]/70">{t("sections.mission.body")}</p>
          </article>
        </section>

        <section className="mb-16">
          <h2 className="mb-10 text-center text-2xl font-heading text-[#2C3E2D]">
            {t("sections.values.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-center text-[#2C3E2D]/70">
            {t("sections.values.body")}
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {BRAND_VALUES.map((value) => (
              <div
                key={value.key}
                className="rounded-lg bg-white p-6 text-center shadow-sm"
              >
                <span className="mb-3 block text-3xl">{value.icon}</span>
                <h3 className="mb-1 font-semibold text-[#2C3E2D]">
                  {t(`values.${value.key}.title`)}
                </h3>
                <p className="text-sm text-[#2C3E2D]/60">
                  {t(`values.${value.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-10 text-center text-2xl font-heading text-[#2C3E2D]">
            {t("team.title")}
          </h2>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#2C3E2D]/10">
                  👤
                </div>
                <h3 className="font-semibold text-[#2C3E2D]">
                  {isZh ? member.nameZh : member.name}
                </h3>
                <p className="text-sm text-[#2C3E2D]/60">
                  {isZh ? member.roleZh : member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
