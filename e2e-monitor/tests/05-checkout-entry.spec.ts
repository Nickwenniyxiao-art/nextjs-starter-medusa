import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const CHECKOUT_URL = `${BASE}/en/dk/checkout`

test.describe('Business Regression - Checkout Entry', () => {
  test('checkout page loads and shows container/progress', async ({ page }) => {
    const response = await page.goto(CHECKOUT_URL)
    expect(response?.ok()).toBeTruthy()

    await expect(page.getByTestId('checkout-container')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('checkout-progress')).toBeVisible({ timeout: 15000 })
  })

  test('checkout address form fields are available for guest flow', async ({ page }) => {
    await page.goto(CHECKOUT_URL)

    await expect(page.getByTestId('shipping-first-name-input')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('shipping-last-name-input')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('shipping-email-input')).toBeVisible({ timeout: 15000 })
  })
})
