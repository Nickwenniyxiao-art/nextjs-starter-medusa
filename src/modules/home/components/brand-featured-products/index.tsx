"use client"

import { HttpTypes } from "@medusajs/types"

import { Brand } from "@/config/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BrandFeaturedProductsProps = {
  brand: Brand
  collections: HttpTypes.StoreCollection[]
}

const BrandFeaturedProducts = ({ brand, collections }: BrandFeaturedProductsProps) => {
  // TODO: Replace with backend brand filter API when available.
  const scopedCollections =
    collections.filter((collection) =>
      collection.handle?.toLowerCase().includes(brand.slug.toLowerCase())
    ).length > 0
      ? collections.filter((collection) =>
          collection.handle?.toLowerCase().includes(brand.slug.toLowerCase())
        )
      : collections

  return (
    <section className="content-container py-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-heading text-brand-primary">Featured for {brand.name}</h2>
        <LocalizedClientLink href="/store" className="text-brand-accent hover:underline">
          View all products
        </LocalizedClientLink>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {scopedCollections.slice(0, 3).map((collection) => (
          <LocalizedClientLink
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className="rounded-xl border border-brand-primary/10 bg-brand-secondary p-6 transition hover:-translate-y-0.5"
          >
            <p className="text-xs uppercase tracking-wider text-brand-accent">Collection</p>
            <h3 className="mt-2 text-lg font-medium text-brand-primary">{collection.title}</h3>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}

export default BrandFeaturedProducts
