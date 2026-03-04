"use client"

import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  const t = useTranslations("home")

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

export default Hero
