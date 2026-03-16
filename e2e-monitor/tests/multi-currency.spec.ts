import { expect, test } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const uiTimeout = 12000

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
    const dkPrice = await page.locator('[data-testid="product-price"], [data-value="price"]').first().textContent()

    await page.goto(`${BASE_URL}/en/us/store`, { timeout: uiTimeout })
    await page.waitForLoadState('networkidle')
    const usPrice = await page.locator('[data-testid="product-price"], [data-value="price"]').first().textContent()

    expect(dkPrice || '').not.toEqual('')
    expect(usPrice || '').not.toEqual('')
    expect(dkPrice).not.toEqual(usPrice)
  })
})
