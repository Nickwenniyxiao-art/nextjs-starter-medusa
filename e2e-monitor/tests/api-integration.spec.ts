import { expect, test } from '@playwright/test'

const API_URL = process.env.API_URL || 'http://localhost:9000'
const API_KEY = process.env.PUBLISHABLE_API_KEY || ''
const apiTimeout = 5000

const apiHeaders: Record<string, string> = API_KEY
  ? { 'x-publishable-api-key': API_KEY }
  : {}

test.describe('Store API 集成测试', () => {
  test('GET /store/products — 商品列表', async ({ request }) => {
    const res = await request.get(`${API_URL}/store/products?limit=5`, {
      headers: apiHeaders,
      timeout: apiTimeout,
    })
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.products)).toBeTruthy()
  })

  test('GET /store/products/:id — 商品详情', async ({ request }) => {
    const productsRes = await request.get(`${API_URL}/store/products?limit=1`, {
      headers: apiHeaders,
      timeout: apiTimeout,
    })
    expect(productsRes.status()).toBe(200)
    const productsData = await productsRes.json()
    const productId = productsData.products?.[0]?.id
    expect(productId).toBeTruthy()

    const detailRes = await request.get(`${API_URL}/store/products/${productId}`, {
      headers: apiHeaders,
      timeout: apiTimeout,
    })
    expect(detailRes.status()).toBe(200)
  })

  test('GET /store/regions — 地区列表', async ({ request }) => {
    const res = await request.get(`${API_URL}/store/regions`, {
      headers: apiHeaders,
      timeout: apiTimeout,
    })
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.regions)).toBeTruthy()
  })

  test('POST /store/carts + /line-items — 创建购物车并添加商品', async ({ request }) => {
    const productsRes = await request.get(`${API_URL}/store/products?limit=1`, {
      headers: apiHeaders,
      timeout: apiTimeout,
    })
    const productsData = await productsRes.json()
    const variantId = productsData.products?.[0]?.variants?.[0]?.id
    expect(variantId).toBeTruthy()

    const cartRes = await request.post(`${API_URL}/store/carts`, {
      headers: apiHeaders,
      timeout: apiTimeout,
      data: {},
    })
    expect(cartRes.status()).toBe(200)
    const cartData = await cartRes.json()
    const cartId = cartData.cart?.id
    expect(cartId).toBeTruthy()

    const lineItemRes = await request.post(`${API_URL}/store/carts/${cartId}/line-items`, {
      headers: apiHeaders,
      timeout: apiTimeout,
      data: { variant_id: variantId, quantity: 1 },
    })
    expect(lineItemRes.status()).toBe(200)
  })

  test('GET /store/collections — 集合列表', async ({ request }) => {
    const res = await request.get(`${API_URL}/store/collections`, {
      headers: apiHeaders,
      timeout: apiTimeout,
    })
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.collections)).toBeTruthy()
  })
})
