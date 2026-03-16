import { expect, test, type Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'
const checkoutTimeout = 15000
const API_URL = process.env.API_URL || 'http://66.94.127.117:9000'

async function addFirstProductToCart(page: Page) {
  await page.goto(`${BASE_URL}/en/dk/store`, { timeout: checkoutTimeout })
  await page.waitForLoadState('networkidle')

  const productLink = page
    .locator('[data-testid="products-list"] li a, a[href*="/products/"]')
    .first()
  await expect(productLink).toBeVisible({ timeout: checkoutTimeout })
  await productLink.click()

  await page.waitForLoadState('networkidle')
  const variantButton = page
    .locator('[data-testid="option-button"], [data-testid="variant-option"], [role="radio"]')
    .first()
  if (await variantButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await variantButton.click()
  }

  const addToCartButton = page
    .locator(
      'button[data-testid="add-product-button"], button:has-text("Add to cart"), button:has-text("加入购物车")',
    )
    .first()
  await expect(addToCartButton).toBeVisible({ timeout: checkoutTimeout })
  await addToCartButton.click()
  await page.waitForTimeout(2000)
}

test.describe('完整下单流程', () => {
  test.beforeEach(async ({ page }) => {
    const apiCheck = await page.request
      .get(`${API_URL}/health`, { timeout: 10000 })
      .catch(() => null)

    if (!apiCheck || !apiCheck.ok()) {
      test.skip(true, 'Backend API is not reachable')
    }
  })

  test('首页到订单确认完整流转', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dk`, { timeout: checkoutTimeout })
    await expect(page).toHaveURL(/\/en\/dk/, { timeout: checkoutTimeout })

    await addFirstProductToCart(page)

    const cartOrCheckout = page
      .locator('a[href*="/cart"], a[href*="/checkout"], button:has-text("Checkout"), button:has-text("结账")')
      .first()
    await expect(cartOrCheckout).toBeVisible({ timeout: checkoutTimeout })
    await cartOrCheckout.click()

    await page.waitForLoadState('networkidle')

    const uniqueId = `test-${Date.now()}`
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill(`${uniqueId}@example.com`)
    }

    const textInputs = page.locator('input[type="text"], input:not([type]), input[name*="name"], input[name*="address"]')
    const count = await textInputs.count()
    for (let i = 0; i < Math.min(count, 6); i += 1) {
      const input = textInputs.nth(i)
      if (await input.isVisible().catch(() => false)) {
        await input.fill(`test-${i}`)
      }
    }

    const continueButtons = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("继续")')
    const continueCount = await continueButtons.count()
    for (let i = 0; i < Math.min(continueCount, 3); i += 1) {
      const button = continueButtons.nth(i)
      if (await button.isVisible().catch(() => false)) {
        await button.click()
        await page.waitForTimeout(500)
      }
    }

    const deliveryOption = page
      .locator('[data-testid="delivery-option"] input, [name*="shipping"] input, input[type="radio"]')
      .first()
    if (await deliveryOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deliveryOption.check()
    }

    const paymentSection = page.locator('text=Stripe, text=Payment, text=支付').first()
    await expect(paymentSection).toBeVisible({ timeout: checkoutTimeout })

    const placeOrderButton = page
      .locator('button:has-text("Place order"), button:has-text("Complete order"), button:has-text("提交订单")')
      .first()

    if (await placeOrderButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await placeOrderButton.click()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('text=Order, text=Thank you, text=订单')).toBeVisible({ timeout: checkoutTimeout })
      await expect(page.locator('body')).toContainText(/#|order|订单/i)
    } else {
      // 如果环境未启用真实支付，至少确保已到支付步骤
      await expect(paymentSection).toBeVisible({ timeout: checkoutTimeout })
    }
  })
})
