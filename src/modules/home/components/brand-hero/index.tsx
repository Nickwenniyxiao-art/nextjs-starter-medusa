"use client"

import { Brand } from "@/config/brands"
import { getDefaultBrand } from "@/config/brands"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BrandHeroProps = {
  brand: Brand
}

const BrandHero = ({ brand }: BrandHeroProps) => {
  const t = useTranslations("home")
  const defaultBrand = getDefaultBrand()
  const isDefault = brand.id === defaultBrand.id

  // Default NordHjem brand: original full-image hero
  if (isDefault) {
    return (
      <div className="relative w-full">
        <div
          className="relative min-h-[75vh] flex flex-col justify-center items-center text-center px-6"
          style={{
            backgroundImage: "url('/images/hero-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-4 tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-2 font-light italic">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8">
              <LocalizedClientLink
                href="/store"
                className="inline-block bg-white text-[#2C3E2D] px-10 py-4 text-base md:text-lg font-medium hover:bg-[#FAFAF8] transition-colors tracking-wide"
              >
                {t("heroCta")}
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Other brands: gradient + subtle background
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
