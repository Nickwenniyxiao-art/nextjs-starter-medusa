import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || ""
  const limit = req.nextUrl.searchParams.get("limit") || "6"
  if (!q.trim()) return NextResponse.json({ products: [] })

  try {
    const response = await fetch(`${BACKEND_URL}/store/products?q=${encodeURIComponent(q)}&limit=${limit}&fields=id,title,handle,thumbnail`, { headers: { "x-publishable-api-key": PUBLISHABLE_KEY }, next: { revalidate: 0 } })
    if (!response.ok) return NextResponse.json({ products: [] })
    const data = await response.json()
    return NextResponse.json({ products: (data.products || []).map((p: any) => ({ id: p.id, title: p.title, handle: p.handle, thumbnail: p.thumbnail })) })
  } catch {
    return NextResponse.json({ products: [] })
  }
}
