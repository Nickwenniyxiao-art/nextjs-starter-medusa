export type Brand = {
  id: string
  name: string
  slug: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  description: string
}

export const brands: Brand[] = [
  {
    id: "brand-nordhjem",
    name: "NordHjem",
    slug: "nordhjem",
    logo: "NH",
    primaryColor: "#2C3E50",
    secondaryColor: "#ECF0F1",
    accentColor: "#3498DB",
    fontFamily: "Inter",
    description: "Nordic minimal furniture and warm living essentials.",
  },
  {
    id: "brand-placeholder-1",
    name: "Atelier Oak",
    slug: "atelier-oak",
    logo: "AO",
    primaryColor: "#5D4037",
    secondaryColor: "#F4ECE6",
    accentColor: "#A1887F",
    fontFamily: "Inter",
    description: "Placeholder brand for artisanal oak furniture.",
  },
  {
    id: "brand-placeholder-2",
    name: "Lumen Casa",
    slug: "lumen-casa",
    logo: "LC",
    primaryColor: "#1E3A5F",
    secondaryColor: "#EDF4FF",
    accentColor: "#4DA3FF",
    fontFamily: "Inter",
    description: "Placeholder brand for modern bright interiors.",
  },
]

export const getDefaultBrand = (): Brand => brands[0]

export const getBrandBySlug = (slug?: string | null): Brand => {
  if (!slug) {
    return getDefaultBrand()
  }

  return brands.find((brand) => brand.slug === slug) ?? getDefaultBrand()
}
