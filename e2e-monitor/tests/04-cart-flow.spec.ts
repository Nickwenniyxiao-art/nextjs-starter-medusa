import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const STORE_URL = `${BASE}/en/dk/store`
const CART_URL = `${BASE}/en/dk/cart`
const API_URL = process.env.API_URL || 'http://66.94.127.117:9000'

test.describe('Business Regression - Cart', () => {
  test.beforeEach(async ({ page }) => {
    const apiCheck = await page.request
      .get(`${API_URL}/health`, { timeout: 10000 })
      .catch(() => null)

    if (!apiCheck || !apiCheck.ok()) {
      test.skip(true, 'Backend API is not reachable')
    }
  })

  test('cart page is reachable and renders expected state', async ({ page }) => {
    const response = await page.goto(CART_URL)
    expect(response?.ok()).toBeTruthy()

    const emptyMessage = page.getByTestId('empty-cart-message')
    const checkoutButton = page.getByRole('link', { name: /go to checkout|checkout/i }).first()

    await expect(emptyMessage.or(checkoutButton)).toBeVisible({ timeout: 15000 })
  })

  test('can add one product then navigate to cart', async ({ page }) => {
    await page.goto(STORE_URL)
    await page.locator('[data-testid="products-list"] a').first().click()
    await page.getByTestId('add-product-button').click()
    await page.waitForTimeout(2000)

    await page.goto(CART_URL)
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })
})
