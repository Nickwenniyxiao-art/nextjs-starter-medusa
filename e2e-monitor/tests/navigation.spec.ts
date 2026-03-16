import { expect, test } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const uiTimeout = 12000

test.describe('页面导航与 SEO', () => {
  test('首页加载、标题和 meta description', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk`, { timeout: uiTimeout })
    await expect(page).toHaveTitle(/.+/, { timeout: uiTimeout })
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveCount(1)
  })

  test('导航菜单链接可访问且页面切换不白屏', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk`, { timeout: uiTimeout })
    const navLinks = page.locator('header a[href], nav a[href]')
    const total = await navLinks.count()

    expect(total).toBeGreaterThan(0)
    const visitCount = Math.min(total, 4)

    for (let i = 0; i < visitCount; i += 1) {
      const href = await navLinks.nth(i).getAttribute('href')
      if (!href || href.startsWith('#')) continue
      await page.goto(new URL(href, `${BASE_URL}/en/dk`).toString(), { timeout: uiTimeout })
      await expect(page.locator('body')).not.toBeEmpty()
      await expect(page.locator('body')).not.toContainText('Something went wrong')
    }
  })

  test('404 页面处理', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk/non-existent-${Date.now()}`, { timeout: uiTimeout })
    await expect(page.locator('body')).toContainText(/404|not found|不存在/i)
  })
})
