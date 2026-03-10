"use client"

import { Brand } from "@/config/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categoryByBrand: Record<
  string,
  { name: string; href: string; image: string }[]
> = {
  nordhjem: [
    { name: "Living Room", href: "/categories/living-room", image: "/images/category-living-room.jpg" },
    { name: "Bedroom", href: "/categories/bedroom", image: "/images/category-bedroom.jpg" },
    { name: "Dining", href: "/categories/dining", image: "/images/category-dining.jpg" },
    { name: "Office", href: "/categories/office", image: "/images/category-office.jpg" },
  ],
  "atelier-oak": [
    { name: "Solid Oak", href: "/categories/living-room", image: "/images/category-living-room.jpg" },
    { name: "Craft Tables", href: "/categories/dining", image: "/images/category-dining.jpg" },
  ],
  "lumen-casa": [
    { name: "Soft Light", href: "/categories/bedroom", image: "/images/category-bedroom.jpg" },
    { name: "Modern Work", href: "/categories/office", image: "/images/category-office.jpg" },
  ],
}

const BrandCategories = ({ brand }: { brand: Brand }) => {
  const categories = categoryByBrand[brand.slug] ?? categoryByBrand.nordhjem

  return (
    <section className="bg-white px-6 py-14">
      <div className="content-container">
        <h2 className="mb-8 text-center text-2xl font-heading text-brand-primary">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <LocalizedClientLink key={category.name} href={category.href} className="group overflow-hidden rounded-xl border border-brand-primary/10">
              <div className="aspect-[4/3] bg-cover bg-center transition group-hover:scale-105" style={{ backgroundImage: `url(${category.image})` }} />
              <div className="bg-brand-secondary p-3 text-brand-primary">{category.name}</div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandCategories
