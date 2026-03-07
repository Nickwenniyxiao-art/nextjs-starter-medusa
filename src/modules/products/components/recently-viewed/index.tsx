"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"

const STORAGE_KEY = "recently-viewed-products"
const MAX_RECENT_PRODUCTS = 8

type RecentlyViewedProps = {
  handle: string
  countryCode: string
}

export default function RecentlyViewed({
  handle,
  countryCode,
}: RecentlyViewedProps) {
  const t = useTranslations("product")
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])

  useEffect(() => {
    const storedRaw = localStorage.getItem(STORAGE_KEY)
    const storedHandles = storedRaw ? (JSON.parse(storedRaw) as string[]) : []

    const filteredHandles = storedHandles
      .filter((storedHandle) => storedHandle && storedHandle !== handle)
      .slice(0, MAX_RECENT_PRODUCTS)

    const nextHandles = [handle, ...filteredHandles].slice(
      0,
      MAX_RECENT_PRODUCTS
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHandles))

    if (!filteredHandles.length) {
      return
    }

    const controller = new AbortController()

    fetch(
      `/api/products/by-handles?countryCode=${countryCode}&handles=${filteredHandles.join(
        ","
      )}`,
      {
        signal: controller.signal,
      }
    )
      .then((response) => response.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {
        setProducts([])
      })

    return () => {
      controller.abort()
    }
  }, [countryCode, handle])

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <h2 className="text-2xl-regular text-ui-fg-base mb-8 text-center">
        {t("recentlyViewedHeading")}
      </h2>

      <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="group"
            >
              <div className="relative aspect-[11/14] w-full overflow-hidden bg-ui-bg-subtle">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <p className="text-base-regular text-ui-fg-subtle mt-4">
                {product.title}
              </p>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
