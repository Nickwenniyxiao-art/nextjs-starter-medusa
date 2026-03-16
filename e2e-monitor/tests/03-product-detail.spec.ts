import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const STORE_URL = `${BASE}/en/dk/store`

test.describe('Business Regression - Product Detail', () => {
  test('open product detail from store list and validate pricing', async ({ page }) => {
    await page.goto(STORE_URL)

    const firstProduct = page.locator('[data-testid="products-list"] a').first()
    await expect(firstProduct).toBeVisible({ timeout: 20000 })
    await firstProduct.click()

    await expect(page).toHaveURL(/\/products\//)
    await expect(page.getByTestId('product-container').getByTestId('product-title')).toBeVisible()

    const price = page.getByTestId('product-container').locator('[data-testid="product-price"], [data-testid="price"]').first()
    await expect(price).toBeVisible({ timeout: 10000 })
    expect((await price.textContent())?.trim().length).toBeGreaterThan(0)
  })

  test('add to cart control is visible on product detail', async ({ page }) => {
    await page.goto(STORE_URL)

    const firstProduct = page.locator('[data-testid="products-list"] a').first()
    await firstProduct.click()

    await expect(page.getByTestId('add-product-button')).toBeVisible({ timeout: 10000 })
  })
})
