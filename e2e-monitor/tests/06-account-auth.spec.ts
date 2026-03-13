import { expect, test } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://nordhjem.store'
const ACCOUNT_URL = `${BASE}/en/dk/account`

test.describe('Business Regression - Account Auth', () => {
  test('account login page renders auth controls', async ({ page }) => {
    const response = await page.goto(ACCOUNT_URL)
    expect(response?.ok()).toBeTruthy()

    await expect(page.getByTestId('login-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('email-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByTestId('sign-in-button')).toBeVisible()
  })

  test('invalid login attempt shows feedback', async ({ page }) => {
    await page.goto(ACCOUNT_URL)

    await page.getByTestId('email-input').fill('invalid@example.com')
    await page.getByTestId('password-input').fill('wrong-password')
    await page.getByTestId('sign-in-button').click()

    await expect(page.getByTestId('login-error-message')).toBeVisible({ timeout: 15000 })
  })
})
