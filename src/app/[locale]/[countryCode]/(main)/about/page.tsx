import { getTranslations, getLocale } from "next-intl/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | NordHjem",
  description: "Discover the story behind NordHjem — Nordic minimalist home furnishing, designed with simplicity and warmth.",
}

const TEAM_MEMBERS = [
  { name: "Erik Larsson", nameZh: "Erik Larsson", role: "Founder & CEO", roleZh: "创始人兼首席执行官" },
  { name: "Ingrid Holm", nameZh: "Ingrid Holm", role: "Head of Design", roleZh: "设计总监" },
  { name: "Nils Andersen", nameZh: "Nils Andersen", role: "Head of Sustainability", roleZh: "可持续发展总监" },
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
      <section className="relative min-h-[40vh] flex items-center justify-center text-center"><div className="absolute inset-0 bg-[#2C3E2D]" /><div className="relative z-10 px-6 py-16"><h1 className="text-4xl md:text-5xl font-heading text-white mb-4">{t("title")}</h1><p className="text-lg text-white/70 max-w-2xl mx-auto">{t("subtitle")}</p></div></section>
      <div className="content-container py-16"><section className="mb-16"><h2 className="text-2xl font-heading text-[#2C3E2D] text-center mb-10">{t("sections.values.title")}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{BRAND_VALUES.map((value)=><div key={value.key} className="bg-white rounded-lg p-6 text-center shadow-sm"><span className="text-3xl mb-3 block">{value.icon}</span><h3 className="font-semibold text-[#2C3E2D] mb-1">{t(`values.${value.key}.title`)}</h3><p className="text-sm text-[#2C3E2D]/60">{t(`values.${value.key}.description`)}</p></div>)}</div></section><section className="mb-16"><h2 className="text-2xl font-heading text-[#2C3E2D] text-center mb-10">{t("team.title")}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">{TEAM_MEMBERS.map((member)=><div key={member.name} className="text-center"><div className="w-24 h-24 rounded-full bg-[#2C3E2D]/10 mx-auto mb-4 flex items-center justify-center">👤</div><h3 className="font-semibold text-[#2C3E2D]">{isZh ? member.nameZh : member.name}</h3><p className="text-sm text-[#2C3E2D]/60">{isZh ? member.roleZh : member.role}</p></div>)}</div></section></div>
    </main>
  )
}
