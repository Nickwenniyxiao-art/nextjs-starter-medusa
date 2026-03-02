"use client"

import { useTranslations } from "next-intl"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  const t = useTranslations("home")

  return (
    <div className="relative w-full bg-warm">
      <div
        className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-6 py-20"
        style={{
          background: "linear-gradient(180deg, #2C3E2D 0%, #3a5240 40%, #FAFAF8 100%)",
        }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-warm mb-4 tracking-tight">
          NordHjem
        </h1>
        <p className="text-lg md:text-2xl text-warm/80 mb-2 font-light">
          {t("heroTitle")}
        </p>
        <p className="text-base md:text-lg text-warm/60 mb-10 max-w-xl">
          {t("heroSubtitle")}
        </p>
        <LocalizedClientLink
          href="/store"
          className="btn-primary text-base md:text-lg px-10 py-4"
        >
          {t("heroCta")}
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
