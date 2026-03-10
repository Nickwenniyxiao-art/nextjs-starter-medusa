import { Metadata } from "next"
import BlogListTemplate from "@modules/cms/templates/blog-list"

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Blog | NordHjem", description: "Nordic living inspiration, design tips, and home décor guides from NordHjem." }
}

export default async function BlogPage() {
  return <BlogListTemplate />
}
