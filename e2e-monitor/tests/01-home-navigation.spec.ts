import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const LOCALE_PATH = '/en/dk'

test.describe('Business Regression - Home & Navigation', () => {
  test('home page renders core sections', async ({ page }) => {
    const response = await page.goto(`${BASE}${LOCALE_PATH}`)
    expect(response?.ok()).toBeTruthy()

    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByTestId('footer')).toBeVisible()
    await expect(page.getByRole('link', { name: /store|shop/i })).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })

  test('can navigate to about page from main navigation', async ({ page }) => {
    await page.goto(`${BASE}${LOCALE_PATH}`)
    await page.getByRole('link', { name: /about/i }).first().click()

    await expect(page).toHaveURL(/\/about/)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('body')).not.toContainText(/about\.\w+\.\w+/)
  })
})
