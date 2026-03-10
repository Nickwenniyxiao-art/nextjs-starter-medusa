export type BlogPost = {
  slug: string
  title: string
  titleZh: string
  excerpt: string
  excerptZh: string
  content: string
  contentZh: string
  coverImage: string
  author: string
  category: string
  categoryZh: string
  publishedAt: string
  readingTime: number
}

export type LandingPage = {
  slug: string
  title: string
  titleZh: string
  heroTitle: string
  heroTitleZh: string
  heroSubtitle: string
  heroSubtitleZh: string
  heroImage: string
  ctaText: string
  ctaTextZh: string
  ctaLink: string
  sections: { title: string; titleZh: string; content: string; contentZh: string; image?: string }[]
}

const BLOG_POSTS: BlogPost[] = [
  { slug: "nordic-minimalism-guide", title: "The Complete Guide to Nordic Minimalism", titleZh: "北欧极简主义完整指南", excerpt: "Discover how Scandinavian design principles can transform your living space into a haven of simplicity and warmth.", excerptZh: "探索斯堪的纳维亚设计原则如何将您的生活空间转变为简约温暖的天堂。", content: "Nordic minimalism is more than just an aesthetic — it's a philosophy of intentional living.\n\n## The Principles\n\n**Functionality First**: Every piece in a Nordic home serves a purpose.", contentZh: "北欧极简主义不仅仅是一种美学——它是一种有意识生活的哲学。\n\n## 核心原则\n\n**功能至上**：北欧家庭中的每件物品都有其用途。", coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=600&fit=crop", author: "NordHjem Editorial", category: "Design Tips", categoryZh: "设计技巧", publishedAt: "2026-03-01", readingTime: 5 },
  { slug: "sustainable-furniture-choices", title: "Making Sustainable Furniture Choices", titleZh: "做出可持续的家具选择", excerpt: "How to furnish your home responsibly with eco-friendly materials and ethical manufacturing.", excerptZh: "如何用环保材料和合乎道德的制造方式负责任地布置您的家。", content: "Sustainability is at the heart of Nordic design philosophy.", contentZh: "可持续性是北欧设计哲学的核心。", coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop", author: "NordHjem Editorial", category: "Sustainability", categoryZh: "可持续发展", publishedAt: "2026-02-20", readingTime: 4 },
]

const LANDING_PAGES: LandingPage[] = [{ slug: "spring-collection", title: "Spring Collection 2026", titleZh: "2026 春季系列", heroTitle: "Welcome Spring Into Your Home", heroTitleZh: "让春天走进您的家", heroSubtitle: "Fresh designs inspired by Nordic spring", heroSubtitleZh: "源自北欧春天的清新设计", heroImage: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1600&h=800&fit=crop", ctaText: "Shop Spring Collection", ctaTextZh: "选购春季系列", ctaLink: "/store", sections: [{ title: "Natural Textiles", titleZh: "天然面料", content: "Our spring collection features organic cotton", contentZh: "我们的春季系列采用有机棉", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=500&fit=crop" }] }]

export const getAllBlogPosts = () => BLOG_POSTS.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
export const getBlogPostBySlug = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug)
export const getAllBlogSlugs = () => BLOG_POSTS.map((post) => post.slug)
export const getBlogCategories = () => Array.from(new Set(BLOG_POSTS.map((post) => post.category)))
export const getLandingPageBySlug = (slug: string) => LANDING_PAGES.find((page) => page.slug === slug)
