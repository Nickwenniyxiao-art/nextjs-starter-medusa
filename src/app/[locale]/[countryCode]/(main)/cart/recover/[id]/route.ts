import { NextRequest } from "next/server"
import { retrieveCart } from "@lib/data/cart"
import { setCartId } from "@lib/data/cookies"
import { notFound, redirect } from "next/navigation"

type Params = Promise<{ id: string; countryCode: string }>

export async function GET(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { id, countryCode } = await params

  try {
    const cart = await retrieveCart(id)

    if (!cart) {
      return notFound()
    }

    await setCartId(id)
    redirect(`/${countryCode}/cart`)
  } catch {
    return notFound()
  }
}
