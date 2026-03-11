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
]

export const getDefaultBrand = (): Brand => brands[0]

export const getBrandBySlug = (slug?: string | null): Brand => {
  if (!slug) {
    return getDefaultBrand()
  }

  return brands.find((brand) => brand.slug === slug) ?? getDefaultBrand()
}

export const getBrandConfig = (slug?: string | null): Brand => {
  return getBrandBySlug(slug)
}
