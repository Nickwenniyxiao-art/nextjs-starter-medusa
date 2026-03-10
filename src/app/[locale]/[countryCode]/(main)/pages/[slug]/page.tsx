import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"
import { getLandingPageBySlug } from "@lib/data/cms"
import Image from "next/image"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const page = getLandingPageBySlug(slug)
  if (!page) return { title: "Not Found" }
  return { title: `${page.title} | NordHjem`, description: page.heroSubtitle }
}

export default async function LandingPage(props: Props) {
  const { slug } = await props.params
  const page = getLandingPageBySlug(slug)
  if (!page) return notFound()
  const isZh = (await getLocale()).startsWith("zh")
  return <div className="bg-[#FAFAF8]"><section className="relative min-h-[60vh] flex items-center justify-center text-center"><Image src={page.heroImage} alt={isZh ? page.heroTitleZh : page.heroTitle} fill className="object-cover" /><div className="absolute inset-0 bg-black/30" /><div className="relative z-10 px-6"><h1 className="text-4xl md:text-6xl font-heading text-white mb-4">{isZh ? page.heroTitleZh : page.heroTitle}</h1><p className="text-lg md:text-xl text-white/80 mb-8">{isZh ? page.heroSubtitleZh : page.heroSubtitle}</p><Link href={page.ctaLink} className="inline-block bg-white text-[#2C3E2D] px-10 py-4">{isZh ? page.ctaTextZh : page.ctaText}</Link></div></section></div>
}
