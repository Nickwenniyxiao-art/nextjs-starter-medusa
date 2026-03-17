import { expect, test, type Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const uiTimeout = 12000


async function addOneProduct(page: Page) {
  const products = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]')
  await expect(products.first()).toBeVisible({ timeout: uiTimeout })
  await products.first().click()
  await page.waitForLoadState('networkidle')

  const variant = page.locator('[data-testid="option-button"], [data-testid="variant-option"], [role="radio"]').first()
  if (await variant.isVisible({ timeout: 3000 }).catch(() => false)) {
    await variant.click()
  }

  const addToCart = page
    .locator('button[data-testid="add-product-button"], button:has-text("Add to cart"), button:has-text("加入购物车")')
    .first()
  await expect(addToCart).toBeVisible({ timeout: uiTimeout })
  await addToCart.click()
  await page.waitForTimeout(2000)
}

test.describe('多币种与多地区', () => {
  test('DK 地区展示 EUR 价格符号', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk/store`, { timeout: uiTimeout })
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/€|eur/i)
  })

  test('US 地区展示 USD 价格符号', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/us/store`, { timeout: uiTimeout })
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/\$|usd/i)
  })

  test('购物车价格随地区切换变化', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk/store`, { timeout: uiTimeout })
    await page.waitForLoadState('networkidle')
    const dkProducts = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]')
    test.skip((await dkProducts.count()) === 0, '⚠️ No products in test environment')

    await addOneProduct(page)
    await page.goto(`${BASE_URL}/en/dk/cart`, { timeout: uiTimeout })
    const dkPrice = await page
      .locator('[data-testid="cart-item"] [data-testid="product-price"], [data-testid="product-price"], [data-value="price"]')
      .first()
      .textContent()

    await page.goto(`${BASE_URL}/en/us/store`, { timeout: uiTimeout })
    await page.waitForLoadState('networkidle')
    const usProducts = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]')
    test.skip((await usProducts.count()) === 0, '⚠️ No products in test environment')

    await addOneProduct(page)
    await page.goto(`${BASE_URL}/en/us/cart`, { timeout: uiTimeout })
    const usPrice = await page
      .locator('[data-testid="cart-item"] [data-testid="product-price"], [data-testid="product-price"], [data-value="price"]')
      .first()
      .textContent()

    expect(dkPrice || '').not.toEqual('')
    expect(usPrice || '').not.toEqual('')
    expect(dkPrice).not.toEqual(usPrice)
  })
})
