import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://nordhjem.store',
    headless: true,
    screenshot: 'only-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});
