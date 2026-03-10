import { getAllBlogPosts, getBlogCategories, BlogPost } from "@lib/data/cms"
import { getLocale, getTranslations } from "next-intl/server"
import Link from "next/link"
import Image from "next/image"

export default async function BlogListTemplate() {
  const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()])
  const isZh = locale.startsWith("zh")
  const posts = getAllBlogPosts()
  const categories = getBlogCategories()

  return <div className="content-container py-12 bg-[#FAFAF8]"><h1 className="text-3xl md:text-4xl font-heading text-[#2C3E2D] mb-2">{t("title")}</h1><p className="text-[#2C3E2D]/60 mb-6">{t("subtitle")}</p><div className="flex gap-3 mb-8 flex-wrap"><span className="px-4 py-2 rounded-full bg-[#2C3E2D] text-white text-sm font-medium">{t("allPosts")}</span>{categories.map((cat)=><span key={cat} className="px-4 py-2 rounded-full bg-white border border-[#2C3E2D]/20 text-[#2C3E2D] text-sm">{isZh ? posts.find((p)=>p.category===cat)?.categoryZh || cat : cat}</span>)}</div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{posts.map((post)=><BlogCard key={post.slug} post={post} isZh={isZh} t={t} />)}</div></div>
}

function BlogCard({ post, isZh, t }: { post: BlogPost; isZh: boolean; t: any }) {
  return <article className="bg-white rounded-lg overflow-hidden shadow-sm"><div className="relative aspect-[16/9]"><Image src={post.coverImage} alt={isZh ? post.titleZh : post.title} fill className="object-cover" /><span className="absolute top-3 left-3 bg-[#2C3E2D]/80 text-white text-xs px-3 py-1 rounded-full">{isZh ? post.categoryZh : post.category}</span></div><div className="p-5"><h2 className="text-lg font-semibold text-[#2C3E2D] mb-2"><Link href={`/blog/${post.slug}`}>{isZh ? post.titleZh : post.title}</Link></h2><p className="text-sm text-[#2C3E2D]/70 line-clamp-3">{isZh ? post.excerptZh : post.excerpt}</p></div></article>
}
