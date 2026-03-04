"use client"

import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    key: "livingRoom",
    href: "/categories/living-room",
    image: "/images/category-living-room.jpg",
  },
  {
    key: "bedroom",
    href: "/categories/bedroom",
    image: "/images/category-bedroom.jpg",
  },
  { key: "dining", href: "/categories/dining", image: "/images/category-dining.jpg" },
  { key: "office", href: "/categories/office", image: "/images/category-office.jpg" },
]

const Categories = () => {
  const t = useTranslations("home")

  return (
    <section className="py-16 px-6 bg-[#FAFAF8]">
      <div className="content-container">
        <h2 className="text-2xl md:text-3xl font-heading text-[#2C3E2D] text-center mb-4">
          {t("categories")}
        </h2>
        <p className="text-[#2C3E2D]/60 text-center mb-12">{t("categoriesSubtitle")}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <LocalizedClientLink key={cat.key} href={cat.href} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                <div
                  className="aspect-[4/3] bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-medium text-[#2C3E2D]">{t(`category_${cat.key}`)}</h3>
                  <p className="text-sm text-[#2C3E2D]/50 mt-1">{t(`category_${cat.key}_sub`)}</p>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
