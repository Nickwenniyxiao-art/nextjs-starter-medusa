import { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogDetailTemplate from "@modules/cms/templates/blog-detail"
import { getBlogPostBySlug } from "@lib/data/cms"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: "Not Found" }
  return { title: `${post.title} | NordHjem Blog`, description: post.excerpt }
}

export default async function BlogDetailPage(props: Props) {
  const { slug } = await props.params
  const post = getBlogPostBySlug(slug)
  if (!post) return notFound()
  return <BlogDetailTemplate post={post} />
}
