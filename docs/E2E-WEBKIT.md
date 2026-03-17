# E2E WebKit 浏览器配置

> 状态: stub | 最后更新: 2026-03-17

## 概述

Playwright E2E 监控新增 WebKit 浏览器项目，实现多浏览器覆盖。

## 配置

- Playwright config: `e2e-monitor/playwright.config.ts`
- 支持浏览器: Chromium, WebKit

## 验证

运行 `cd e2e-monitor && npx playwright test --project=webkit` 验证 WebKit 测试通过。
