import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'

test.describe('Business Regression - Checkout Entry', () => {
  test('checkout route exists and renders checkout layout', async ({ page }) => {
    // Checkout without cart will show "Page not found" inside the checkout layout
    // This test verifies the checkout route/layout renders (not 500 error)
    const response = await page.goto(`${BASE}/dk/checkout`)
    // May be 404 (no cart) but should not be 500
    expect(response?.status()).toBeLessThan(500)

    // The checkout layout has a "Back to shopping cart" link
    await expect(page.getByTestId('back-to-cart-link')).toBeVisible({ timeout: 15000 })
  })

  test('cart page loads and shows empty state or items', async ({ page }) => {
    // Cart page should always be accessible
    const response = await page.goto(`${BASE}/en/dk/cart`)
    expect(response?.ok()).toBeTruthy()

    // Should show either cart items or empty cart message
    const body = page.locator('body')
    await expect(body).not.toContainText('Something went wrong')
    // Either "Your cart is empty" or cart items should be present
    await expect(
      body.getByText(/cart|empty|shopping/i).first()
    ).toBeVisible({ timeout: 15000 })
  })
})
