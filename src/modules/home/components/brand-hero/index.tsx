"use client"

import { Brand } from "@/config/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BrandHeroProps = {
  brand: Brand
}

const BrandHero = ({ brand }: BrandHeroProps) => {
  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center px-6 text-center"
      style={{
        background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.accentColor} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[url('/images/hero-banner.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 max-w-3xl text-white">
        <p className="mb-4 text-sm uppercase tracking-[0.2em]">{brand.name}</p>
        <h1 className="mb-4 text-4xl font-semibold md:text-6xl">Designed for Calm Living</h1>
        <p className="mb-8 text-white/85">{brand.description}</p>
        <LocalizedClientLink
          href="/store"
          className="inline-block rounded-full px-8 py-3 font-medium text-brand-primary"
          style={{ backgroundColor: brand.secondaryColor }}
        >
          Explore {brand.name}
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default BrandHero
