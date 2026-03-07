import { listProducts } from "@lib/data/products"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("countryCode")
  const handles = request.nextUrl.searchParams
    .get("handles")
    ?.split(",")
    .map((handle) => handle.trim())
    .filter(Boolean)
    .slice(0, 8)

  if (!countryCode || !handles?.length) {
    return NextResponse.json({ products: [] })
  }

  const products = await listProducts({
    countryCode,
    queryParams: {
      handle: handles,
      limit: handles.length,
      is_giftcard: false,
    },
  }).then(({ response }) => {
    const productsByHandle = new Map(
      response.products.map((product) => [product.handle, product])
    )

    return handles.map((handle) => productsByHandle.get(handle)).filter(Boolean)
  })

  return NextResponse.json({ products })
}
