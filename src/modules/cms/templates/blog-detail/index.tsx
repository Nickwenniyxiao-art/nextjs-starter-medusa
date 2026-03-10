import { BlogPost } from "@lib/data/cms"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

export default async function BlogDetailTemplate({ post }: { post: BlogPost }) {
  const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()])
  const isZh = locale.startsWith("zh")
  const title = isZh ? post.titleZh : post.title
  const content = isZh ? post.contentZh : post.content

  return <article className="content-container py-12 bg-[#FAFAF8]"><div className="max-w-3xl mx-auto"><nav className="flex items-center gap-2 text-sm text-[#2C3E2D]/50 mb-6"><Link href="/">{t("home")}</Link><span>/</span><Link href="/blog">{t("title")}</Link></nav><h1 className="text-3xl font-heading text-[#2C3E2D] mb-4">{title}</h1><div className="relative aspect-[2/1] rounded-lg overflow-hidden mb-10"><Image src={post.coverImage} alt={title} fill className="object-cover" /></div>{content.split("\n\n").map((block, i)=><p key={i} className="leading-7 text-[#2C3E2D]/80 mb-4">{block.replace(/^##\s/,"")}</p>)}</div></article>
}
