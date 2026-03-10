"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { getAllBlogPosts } from "@lib/data/cms"

export default function AdminCmsTemplate() {
  const t = useTranslations("admin")
  const posts = getAllBlogPosts()
  const [activeTab, setActiveTab] = useState<"posts" | "pages">("posts")
  const postItems = posts.map((p) => ({ id: p.slug, title: p.title, status: "published", updatedAt: p.publishedAt }))
  const pageItems = [{ id: "spring-collection", title: "Spring Collection 2026", status: "published", updatedAt: "2026-03-01" }]
  const items = activeTab === "posts" ? postItems : pageItems
  return <div className="w-full" data-testid="admin-cms-container"><h1 className="text-2xl font-heading text-[#2C3E2D] mb-4">{t("cmsManagement")}</h1><div className="flex gap-2 mb-4"><button onClick={() => setActiveTab("posts")}>{t("cmsBlogPosts")}</button><button onClick={() => setActiveTab("pages")}>{t("cmsLandingPages")}</button></div><table className="w-full"><tbody>{items.map((item)=><tr key={item.id}><td>{item.title}</td><td>{item.status}</td><td>{item.updatedAt}</td></tr>)}</tbody></table></div>
}
