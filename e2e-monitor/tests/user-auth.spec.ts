import { expect, test } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const uiTimeout = 15000

test.describe('用户认证流程', () => {
  test.skip('注册新用户（唯一邮箱）', async ({ page }) => {
    const unique = `test-${Date.now()}`
    await page.goto(`${BASE_URL}/en/dk/account`, { timeout: uiTimeout })

    const registerTrigger = page.locator('text=Register, text=Sign up, text=注册').first()
    if (await registerTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
      await registerTrigger.click()
    }

    const email = page.locator('input[type="email"], input[name="email"]').first()
    await email.fill(`${unique}@example.com`)

    const password = page.locator('input[type="password"]').first()
    await password.fill('Test1234!')

    const submit = page.locator('button:has-text("Register"), button:has-text("Sign up"), button:has-text("注册")').first()
    await submit.click()

    await expect(page.locator('body')).toContainText(/account|welcome|我的账户|登录/i)
  })

  test('登录失败（错误密码）', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk/account`, { timeout: uiTimeout })
    await page.locator('input[type="email"], input[name="email"]').first().fill(`wrong-${Date.now()}@example.com`)
    await page.locator('input[type="password"]').first().fill('WrongPassword!')
    await page.locator('button:has-text("Sign in"), button:has-text("Login"), button:has-text("登录")').first().click()
    await expect(page.locator('body')).toContainText(/invalid|incorrect|failed|错误/i)
  })

  test.skip('登录、退出与状态持久化', async ({ page, context }) => {
    const email = process.env.E2E_EXISTING_USER_EMAIL || 'existing-user@example.com'
    const password = process.env.E2E_EXISTING_USER_PASSWORD || 'Test1234!'

    await page.goto(`${BASE_URL}/en/dk/account`, { timeout: uiTimeout })
    await page.locator('input[type="email"], input[name="email"]').first().fill(email)
    await page.locator('input[type="password"]').first().fill(password)
    await page.locator('button:has-text("Sign in"), button:has-text("Login"), button:has-text("登录")').first().click()

    await expect(page.locator('body')).toContainText(/account|orders|我的账户/i)

    const isLoggedIn = await page
      .locator('text=My Account, text=我的账户, text=Account, [data-testid="account-link"]')
      .first()
      .isVisible({ timeout: 10000 })
      .catch(() => false)

    if (!isLoggedIn) {
      const cookies = await context.cookies()
      if (cookies.length === 0) {
        console.log('⚠️ No cookies found after login. Auth may use token-based storage.')
      }
    }

    const logout = page.locator('button:has-text("Sign out"), button:has-text("Logout"), text=退出').first()
    if (await logout.isVisible({ timeout: 5000 }).catch(() => false)) {
      await logout.click()
      await expect(page.locator('body')).toContainText(/sign in|login|登录/i)
    }
  })
})
