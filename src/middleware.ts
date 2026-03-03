import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)
const DEFAULT_COUNTRY_CODE =
  process.env.NEXT_PUBLIC_DEFAULT_REGION?.toLowerCase() || "us"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}/${DEFAULT_COUNTRY_CODE}${search}`, request.url)
    )
  }

  const localeMatch = pathname.match(/^\/([a-zA-Z-]+)\/?$/)

  if (localeMatch && routing.locales.includes(localeMatch[1] as "en" | "zh")) {
    return NextResponse.redirect(
      new URL(`/${localeMatch[1]}/${DEFAULT_COUNTRY_CODE}${search}`, request.url)
    )
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
