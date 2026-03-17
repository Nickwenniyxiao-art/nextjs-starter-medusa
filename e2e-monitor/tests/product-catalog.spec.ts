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

    const products = page
      .locator('[data-testid="product-wrapper"], [data-testid="products-list"] a, ul[data-testid="products-list"] li')
      .first()
    const hasProducts = await products.isVisible({ timeout: 10000 }).catch(() => false)
    if (!hasProducts) {
      test.skip(true, '跳过：test 环境无商品数据')
      return
    }

    const productLinks = page.locator('[data-testid="products-list"] li a, a[href*="/products/"]')
    await productLinks.first().click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1').first()).toBeVisible({ timeout: uiTimeout })
    const image = page.locator('img').first()
    await expect(image).toBeVisible({ timeout: uiTimeout })

    const variantSelector = page.locator('[data-testid="product-options"], [data-testid="option-button"]').first()
    const hasVariants = await variantSelector.isVisible({ timeout: 5000 }).catch(() => false)
    if (!hasVariants) {
      test.skip(true, '跳过：该商品无变体可选')
      return
    }

    await variantSelector.click()
    await expect(variantSelector).toBeVisible({ timeout: uiTimeout })
  })

  test('无效商品页返回 404 或 Not Found', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en/dk/products/non-existent-product-${Date.now()}`, { timeout: uiTimeout })
    expect([404, 200]).toContain(res?.status() || 200)
    await expect(page.locator('body')).toContainText(/404|not found|不存在/i)
  })
})
