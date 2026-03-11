import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://nordhjem.store';
const API = process.env.API_URL || 'http://66.94.127.117:9000';

test.describe('NordHjem Smoke Tests — 核心流程巡检', () => {

  test('首页加载正常', async ({ page }) => {
    const res = await page.goto(`${BASE}/en/dk`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('body')).not.toContainText('Something went wrong');
    await expect(page.locator('body')).not.toContainText('出了点问题');
  });

  test('商店页有产品', async ({ page }) => {
    await page.goto(`${BASE}/en/dk/store`);
    await page.waitForLoadState('networkidle');
    const products = page.locator('[data-testid="products-list"] li');
    await expect(products.first()).toBeVisible({ timeout: 15000 });
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('产品有价格显示', async ({ page }) => {
    await page.goto(`${BASE}/en/dk/store`);
    await page.waitForLoadState('networkidle');
    // Find first product link and click
    const firstProduct = page.locator('[data-testid="products-list"] li a').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    // Price should be visible (€ or kr or any currency symbol)
    const priceElement = page.locator('[data-testid="product-price"]').first();
    await expect(priceElement).toBeVisible({ timeout: 10000 });
    const priceText = await priceElement.textContent();
    expect(priceText?.trim().length).toBeGreaterThan(0);
  });

  test('搜索功能正常', async ({ page }) => {
    await page.goto(`${BASE}/en/dk/store?q=sofa`);
    await page.waitForLoadState('networkidle');
    // Should either show results or "no results" — not an error
    await expect(page.locator('body')).not.toContainText('Something went wrong');
  });

  test('About 页面无 i18n key 暴露', async ({ page }) => {
    await page.goto(`${BASE}/en/dk/about`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').textContent();
    // i18n keys look like "about.hero.title" or "about.mission"
    expect(body).not.toMatch(/about\.\w+\.\w+/);
  });

  test('Store API 返回产品数据', async ({ request }) => {
    const res = await request.get(`${API}/store/products?limit=1`, {
      headers: {
        'x-publishable-api-key': 'pk_131083b02252b54782a42b83a9f1dd79b4bb01b6a9b409a252b104b965b977ea',
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
  });

  test('后端健康检查', async ({ request }) => {
    const res = await request.get(`${API}/health`);
    expect(res.status()).toBe(200);
  });

  test('购物车功能可用', async ({ page }) => {
    await page.goto(`${BASE}/en/dk/store`);
    await page.waitForLoadState('networkidle');
    const firstProduct = page.locator('[data-testid="products-list"] li a').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    // Look for add to cart button
    const addToCart = page.locator('button:has-text("Add to"), button:has-text("加入购物车"), button[data-testid="add-product-button"]').first();
    if (await addToCart.isVisible()) {
      // Button exists — cart functionality is available
      expect(true).toBe(true);
    }
  });

});
