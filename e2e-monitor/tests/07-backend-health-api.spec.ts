import { expect, test } from '@playwright/test'

const API = process.env.API_URL || 'http://66.94.127.117:9000'
const API_KEY = process.env.PUBLISHABLE_API_KEY || 'pk_131083b02252b54782a42b83a9f1dd79b4bb01b6a9b409a252b104b965b977ea'

test.describe('Business Regression - Backend & Store API', () => {
  test('health endpoint responds 200', async ({ request }) => {
    const response = await request.get(`${API}/health`)
    expect(response.status()).toBe(200)
  })

  test('store products endpoint returns product list', async ({ request }) => {
    const response = await request.get(`${API}/store/products?limit=3`, {
      headers: {
        'x-publishable-api-key': API_KEY,
      },
    })

    expect(response.status()).toBe(200)
    const payload = await response.json()
    expect(Array.isArray(payload.products)).toBeTruthy()
    expect(payload.products.length).toBeGreaterThan(0)
  })
})
