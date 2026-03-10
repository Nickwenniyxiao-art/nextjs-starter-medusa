import { Metadata } from "next"
import { headers } from "next/headers"

import { getBrandConfig } from "@/config/brands"
import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { BrandProvider } from "@lib/util/brand-context"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import CookieConsent from "@modules/common/components/cookie-consent"
import ErrorBoundary from "@modules/common/components/error-boundary"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL("https://nordhjem.store"),
  openGraph: {
    type: "website",
    siteName: "NordHjem",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const headersList = await headers()
  const hostname = headersList.get("host") || ""
  const brand = getBrandConfig(hostname)
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <BrandProvider brand={brand}>
      <ErrorBoundary>
        <Nav />
        {customer && cart && (
          <CartMismatchBanner customer={customer} cart={cart} />
        )}

        {cart && (
          <FreeShippingPriceNudge
            variant="popup"
            cart={cart}
            shippingOptions={shippingOptions}
          />
        )}
        {props.children}
        <Footer />
        <CookieConsent />
      </ErrorBoundary>
    </BrandProvider>
  )
}
