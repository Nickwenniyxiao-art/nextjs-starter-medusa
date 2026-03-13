import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const LOCALE_PATH = '/en/dk'

test.describe('Business Regression - Home & Navigation', () => {
  test('home page renders core sections', async ({ page }) => {
    const response = await page.goto(`${BASE}${LOCALE_PATH}`)
    expect(response?.ok()).toBeTruthy()

    // Header with nav
    await expect(page.locator('header')).toBeVisible()
    // Footer element (no data-testid, use semantic selector)
    await expect(page.locator('footer')).toBeVisible()
    // Store link in nav
    await expect(page.getByTestId('nav-store-link')).toBeVisible()
    // Hero section with Shop Now CTA
    await expect(page.getByRole('link', { name: /shop now/i })).toBeVisible()
    // No error state
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })

  test('can navigate to about page from footer link', async ({ page }) => {
    await page.goto(`${BASE}${LOCALE_PATH}`)
    // About link is in the footer, not main nav
    await page.locator('footer').getByRole('link', { name: /about us/i }).first().click()

    await expect(page).toHaveURL(/\/about/)
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })
})
