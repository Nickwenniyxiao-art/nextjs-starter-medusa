import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const STORE_URL = `${BASE}/en/dk/store`

test.describe('Business Regression - Store Browse & Search', () => {
  test('store page lists products', async ({ page }) => {
    const response = await page.goto(STORE_URL)
    expect(response?.ok()).toBeTruthy()

    const products = page.locator('[data-testid="products-list"] [data-testid="product-wrapper"]')
    await expect(products.first()).toBeVisible({ timeout: 20000 })
    expect(await products.count()).toBeGreaterThan(0)
  })

  test('search query returns a stable store result page', async ({ page }) => {
    await page.goto(`${STORE_URL}?q=sofa`)
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL(/\/store\?q=sofa/)
    await expect(page.locator('[data-testid="store-page-title"]')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })
})
