"use client"

import { HttpTypes } from "@medusajs/types"

import { useBrand } from "@lib/context/brand-context"
import BrandCategories from "@modules/home/components/brand-categories"
import BrandFeaturedProducts from "@modules/home/components/brand-featured-products"
import BrandHero from "@modules/home/components/brand-hero"

const BrandHomeContent = ({
  collections,
}: {
  collections: HttpTypes.StoreCollection[]
}) => {
  const { currentBrand } = useBrand()

  return (
    <>
      <BrandHero brand={currentBrand} />
      <BrandCategories brand={currentBrand} />
      <BrandFeaturedProducts brand={currentBrand} collections={collections} />
    </>
  )
}

export default BrandHomeContent
