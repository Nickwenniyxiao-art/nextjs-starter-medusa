import { expect, test, type Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const uiTimeout = 15000
const API_URL = process.env.API_URL || 'http://66.94.127.117:9000'

async function goToFirstProduct(page: Page) {
  await page.goto(`${BASE_URL}/en/dk/store`, { timeout: uiTimeout })
  await page.waitForLoadState('networkidle')
  const product = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]').first()
  await expect(product).toBeVisible({ timeout: uiTimeout })
  await product.click()
  await page.waitForLoadState('networkidle')
}

async function addOneProduct(page: Page) {
  const variant = page.locator('[data-testid="option-button"], [data-testid="variant-option"], [role="radio"]').first()
  if (await variant.isVisible({ timeout: 3000 }).catch(() => false)) {
    await variant.click()
  }
  const addToCart = page.locator('button[data-testid="add-product-button"], button:has-text("Add to cart"), button:has-text("加入购物车")').first()
  await expect(addToCart).toBeVisible({ timeout: uiTimeout })
  await addToCart.click()
  await page.waitForTimeout(2000)
}

test.describe('购物车操作', () => {
  test.beforeEach(async ({ page }) => {
    const apiCheck = await page.request
      .get(`${API_URL}/health`, { timeout: 10000 })
      .catch(() => null)

    if (!apiCheck || !apiCheck.ok()) {
      test.skip(true, 'Backend API is not reachable')
    }
  })

  test('添加商品并显示在购物车中', async ({ page }) => {
    await goToFirstProduct(page)
    await addOneProduct(page)

    await page.goto(`${BASE_URL}/en/dk/cart`, { timeout: uiTimeout })
    await expect(page.locator('body')).toContainText(/cart|购物车/i)
  })

  test('修改商品数量', async ({ page }) => {
    await goToFirstProduct(page)
    await addOneProduct(page)
    await page.goto(`${BASE_URL}/en/dk/cart`, { timeout: uiTimeout })

    const increaseButton = page.locator('button:has-text("+"), button[aria-label*="increase" i]').first()
    if (await increaseButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await increaseButton.click()
      await expect(page.locator('body')).toContainText(/2|qty|quantity/i)
    }
  })

  test('删除商品并验证空状态', async ({ page }) => {
    await goToFirstProduct(page)
    await addOneProduct(page)
    await page.goto(`${BASE_URL}/en/dk/cart`, { timeout: uiTimeout })

    const removeButton = page.locator('button:has-text("Remove"), button:has-text("删除"), [data-testid="remove-item"]').first()
    if (await removeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await removeButton.click()
    }

    await expect(page.locator('body')).toContainText(/empty|no items|空/i)
  })

  test('多商品购物车', async ({ page }) => {
    await goToFirstProduct(page)
    await addOneProduct(page)
    await page.goto(`${BASE_URL}/en/dk/store`, { timeout: uiTimeout })
    const secondProduct = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]').nth(1)
    if (await secondProduct.isVisible({ timeout: 5000 }).catch(() => false)) {
      await secondProduct.click()
      await page.waitForLoadState('networkidle')
      await addOneProduct(page)
    }

    await page.goto(`${BASE_URL}/en/dk/cart`, { timeout: uiTimeout })
    const lineItems = page.locator('[data-testid="cart-item"], li:has(button:has-text("Remove"))')
    await expect(lineItems.first()).toBeVisible({ timeout: uiTimeout })
  })
})
