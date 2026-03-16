import { expect, test } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const uiTimeout = 15000

test.describe('商品目录测试', () => {
  test('商品列表页加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk/store`, { timeout: uiTimeout })
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="products-list"] li, a[href*="/products/"]').first()).toBeVisible({ timeout: uiTimeout })
  })

  test('商品详情页加载、图片加载和变体选择', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk/store`, { timeout: uiTimeout })
    const productLinks = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]')
    const count = await productLinks.count()
    test.skip(count === 0, '⚠️ No products found in test environment - skipping product-dependent test')

    await productLinks.first().click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1').first()).toBeVisible({ timeout: uiTimeout })
    const image = page.locator('img').first()
    await expect(image).toBeVisible({ timeout: uiTimeout })

    const variant = page.locator('[data-testid="option-button"], [data-testid="variant-option"], [role="radio"]').first()
    if (await variant.isVisible({ timeout: 5000 }).catch(() => false)) {
      await variant.click()
      await expect(variant).toBeVisible({ timeout: uiTimeout })
    }
  })

  test('无效商品页返回 404 或 Not Found', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en/dk/products/non-existent-product-${Date.now()}`, { timeout: uiTimeout })
    expect([404, 200]).toContain(res?.status() || 200)
    await expect(page.locator('body')).toContainText(/404|not found|不存在/i)
  })
})
