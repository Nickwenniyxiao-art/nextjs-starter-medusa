import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const LOCALE_PATH = '/en/dk'

test.describe('Business Regression - About Page', () => {
  test('about page renders core sections', async ({ page }) => {
    const response = await page.goto(`${BASE}${LOCALE_PATH}/about`)
    expect(response?.ok()).toBeTruthy()

    // Header with title
    await expect(page.getByRole('heading', { name: /about us/i })).toBeVisible()
    // Subtitle should be present
    await expect(page.getByText(/discover the story behind nordhjem/i)).toBeVisible()
    // Team section title
    await expect(page.getByRole('heading', { name: /team/i })).toBeVisible()
    // Values section title
    await expect(page.getByRole('heading', { name: /values/i })).toBeVisible()
    // No error state
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })

  test('team members are displayed correctly', async ({ page }) => {
    await page.goto(`${BASE}${LOCALE_PATH}/about`)

    // Check for team member names
    const teamMembers = ['Erik Larsson', 'Ingrid Holm', 'Nils Andersen']
    for (const member of teamMembers) {
      await expect(page.getByText(member)).toBeVisible()
    }
  })

  test('values section displays correct information', async ({ page }) => {
    await page.goto(`${BASE}${LOCALE_PATH}/about`)

    // Check for values section content
    await expect(page.getByRole('heading', { name: /values/i })).toBeVisible()
    await expect(page.getByText(/nordic minimalist home furnishing/i)).toBeVisible()
  })
})
