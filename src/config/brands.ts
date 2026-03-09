export interface BrandConfig {
  id: string
  name: string
  tagline: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  domain: string
  salesChannelId?: string
  fonts: {
    heading: string
    body: string
    cjk: string
  }
}

const brands: Record<string, BrandConfig> = {
  nordhjem: {
    id: "nordhjem",
    name: "NordHjem",
    tagline: "Nordic Minimalist Living",
    logo: "/images/nordhjem-logo.svg",
    favicon: "/favicon.ico",
    primaryColor: "#2C3E2D",
    secondaryColor: "#FAFAF8",
    accentColor: "#B8956A",
    domain: "nordhjem.store",
    fonts: {
      heading: "DM Serif Display",
      body: "Inter",
      cjk: "Noto Sans SC",
    },
  },
}

const DEFAULT_BRAND = "nordhjem"

export function getBrandConfig(hostname?: string, brandParam?: string): BrandConfig {
  if (brandParam && brands[brandParam]) {
    return brands[brandParam]
  }

  if (hostname) {
    const found = Object.values(brands).find(
      (brand) => hostname === brand.domain || hostname.endsWith(`.${brand.domain}`)
    )

    if (found) {
      return found
    }
  }

  return brands[DEFAULT_BRAND]
}

export function getAllBrands(): BrandConfig[] {
  return Object.values(brands)
}

export default brands
