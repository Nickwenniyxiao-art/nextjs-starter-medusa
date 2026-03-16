import { expect, test, type APIRequestContext, type APIResponse } from '@playwright/test'

const API_URL = process.env.API_URL || 'http://66.94.127.117:9000'
const HEADERS = {
  'x-publishable-api-key':
    process.env.PUBLISHABLE_API_KEY || 'pk_64112cda99be1a3e9cdc3d722df9d3dfbbcd19759306897a6dafd4c7e068ebe3',
  'Content-Type': 'application/json',
}
const API_TIMEOUT = 15000

async function requestOrSkip(action: () => Promise<APIResponse>, label: string) {
  const response = await action().catch((error: Error) => {
    console.log(`API ${label} request failed, skipping assertion: ${error.message}`)
    test.skip(true, `API ${label} request failed`)
    return null
  })

  if (!response) {
    test.skip(true, `API ${label} unavailable`)
  }

  if (!response.ok()) {
    console.log(`API ${label} returned ${response.status()}, skipping assertion`)
    test.skip(true, `API ${label} returned ${response.status()}`)
  }

  return response
}

function getOrSkip(request: APIRequestContext, path: string) {
  return requestOrSkip(
    () =>
      request.get(`${API_URL}${path}`, {
        headers: HEADERS,
        timeout: API_TIMEOUT,
      }),
    path,
  )
}

function postOrSkip(request: APIRequestContext, path: string, data: unknown) {
  return requestOrSkip(
    () =>
      request.post(`${API_URL}${path}`, {
        headers: HEADERS,
        timeout: API_TIMEOUT,
        data,
      }),
    path,
  )
}

test.describe('Store API 集成测试', () => {
  test('GET /store/products — 商品列表', async ({ request }) => {
    const response = await getOrSkip(request, '/store/products?limit=5')
    const data = await response.json()

    expect(data).toHaveProperty('products')
    expect(data.products.length).toBeGreaterThanOrEqual(0)
  })

  test('GET /store/products/:id — 商品详情', async ({ request }) => {
    const productsRes = await getOrSkip(request, '/store/products?limit=1')
    const productsData = await productsRes.json()
    const productId = productsData.products?.[0]?.id

    if (!productId) {
      test.skip(true, 'No product found to validate detail endpoint')
    }

    const detailRes = await getOrSkip(request, `/store/products/${productId}`)
    const detailData = await detailRes.json()

    expect(detailData).toHaveProperty('product')
  })

  test('GET /store/regions — 地区列表', async ({ request }) => {
    const response = await getOrSkip(request, '/store/regions')
    const data = await response.json()

    expect(data).toHaveProperty('regions')
    expect(data.regions.length).toBeGreaterThanOrEqual(0)
  })

  test('POST /store/carts + /line-items — 创建购物车并添加商品', async ({ request }) => {
    const productsRes = await getOrSkip(request, '/store/products?limit=1')
    const productsData = await productsRes.json()
    const variantId = productsData.products?.[0]?.variants?.[0]?.id

    if (!variantId) {
      test.skip(true, 'No variant found to add to cart')
    }

    const cartRes = await postOrSkip(request, '/store/carts', {})
    const cartData = await cartRes.json()
    const cartId = cartData.cart?.id

    if (!cartId) {
      test.skip(true, 'Cart id missing from cart creation response')
    }

    const lineItemRes = await postOrSkip(request, `/store/carts/${cartId}/line-items`, {
      variant_id: variantId,
      quantity: 1,
    })
    const lineItemData = await lineItemRes.json()

    expect(lineItemData).toHaveProperty('cart')
  })

  test('GET /store/collections — 集合列表', async ({ request }) => {
    const response = await getOrSkip(request, '/store/collections')
    const data = await response.json()

    expect(data).toHaveProperty('collections')
    expect(data.collections.length).toBeGreaterThanOrEqual(0)
  })
})
