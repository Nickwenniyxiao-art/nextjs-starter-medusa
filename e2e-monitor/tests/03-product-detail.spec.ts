import { expect, test, type Page } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const STORE_URL = `${BASE}/en/dk/store`

const getTitleLocator = async (page: Page) => {
  const productContainer = page.getByTestId('product-container')

  if ((await productContainer.count()) > 0) {
    return productContainer.first().getByTestId('product-title').first()
  }

  return page.locator('[data-testid="product-title"]').first()
}

const getPriceLocator = async (page: Page) => {
  const productContainer = page.getByTestId('product-container')

  if ((await productContainer.count()) > 0) {
    return productContainer.first().locator('[data-testid="product-price"], [data-testid="price"]').first()
  }

  return page.locator('[data-testid="product-price"], [data-testid="price"]').first()
}

test.describe('Business Regression - Product Detail', () => {
  test('open product detail from store list and validate pricing', async ({ page }) => {
    await page.goto(STORE_URL)

    const products = page.locator('[data-testid="products-list"] a')
    test.skip((await products.count()) === 0, '⚠️ No products in test environment')

    const firstProduct = products.first()
    await expect(firstProduct).toBeVisible({ timeout: 20000 })
    await firstProduct.click()

    await expect(page).toHaveURL(/\/products\//)

    const title = await getTitleLocator(page)
    await expect(title).toBeVisible()

    const price = await getPriceLocator(page)
    await expect(price).toBeVisible({ timeout: 10000 })
    expect((await price.textContent())?.trim().length).toBeGreaterThan(0)
  })

  test('add to cart control is visible on product detail', async ({ page }) => {
    await page.goto(STORE_URL)

    const products = page.locator('[data-testid="products-list"] a')
    test.skip((await products.count()) === 0, '⚠️ No products in test environment')

    const firstProduct = products.first()
    await firstProduct.click()

    await expect(page.getByTestId('add-product-button').first()).toBeVisible({ timeout: 10000 })
  })
})
