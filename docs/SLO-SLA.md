# NordHjem 前端 SLO/SLA 定义

> 项目名称: NordHjem Frontend
> 创建日期: 2026-03-18
> 状态: Active
> 负责人: CTO (AI)
> 与后端 SLA 保持对齐，版本: 1.0

---

## 服务范围

本文档适用于 NordHjem 电商平台前端（Next.js Store）所有面向用户的页面与功能。

- Store 前端页面（Next.js on Vercel/Railway）
- 核心用户流程：商品浏览 → 加购 → 结账 → 订单确认

---

## SLO（服务等级目标）

### 可用性 SLO

| 环境 | 目标 | 测量方式 | 测量周期 |
|------|------|---------|---------|
| Production | **99.5%** | Playwright 巡检（每 15 分钟）+ Uptime Kuma | 滚动 30 天 |
| Staging | 95% | CI 构建成功率 | 周度 |

排除计划维护窗口（每月最多 2 小时，需提前公告）。

### 性能 SLO

| 指标 | 目标 | 测量工具 |
|------|------|---------|
| LCP（最大内容渲染） | ≤ 2.5s | Lighthouse CI（每次 PR） |
| FID / INP（交互延迟） | ≤ 200ms | Sentry 性能监控 |
| CLS（布局偏移） | ≤ 0.1 | Lighthouse CI |
| 首页 TTFB | ≤ 800ms | Sentry tracing |
| JS Bundle Size | ≤ 500KB（gzipped） | Bundle Size Check（每次 PR） |

### 错误率 SLO

| 指标 | 目标 | 告警阈值 | 测量工具 |
|------|------|---------|---------|
| 前端 JS 错误率 | < 0.5%（按 session） | 1 小时内 > 100 个错误 | Sentry |
| 404 页面率 | < 1%（按请求） | — | 应用日志 |
| Core 业务流程成功率 | > 99%（加购/结账） | < 95% 触发告警 | Playwright 巡检 |

---

## SLA（服务等级协议）

### 响应与修复时限

| 级别 | 定义 | 响应时限 | 修复时限 |
|------|------|---------|---------|
| P0 | 全站不可用 / 支付流程中断 | 5 分钟 | 4 小时 |
| P1 | 核心页面异常（商品页/购物车） | 30 分钟 | 8 小时 |
| P2 | 性能严重降级（LCP > 5s） | 4 小时 | 48 小时 |
| P3 | 非核心页面问题 / UI 异常 | 24 小时 | 下个 Sprint |

### 告警通道

| 级别 | 通道 |
|------|------|
| P0/P1 | Telegram Bot + GitHub Issue（自动创建） |
| P2 | Telegram Bot |
| P3 | GitHub Issue |

---

## 例外条款

以下场景不纳入 SLA 违约范围：

- 第三方服务不可用（Stripe、Medusa 后端、CDN）
- 不可抗力（区域性网络中断、DNS 污染等）
- 已提前公告的计划维护窗口
- 客户侧网络/浏览器兼容性问题

---

## 监控覆盖

| 监控项 | 工具 | 频率 |
|--------|------|------|
| 核心流程可用性 | Playwright 巡检 | 每 15 分钟 |
| Core Web Vitals | Lighthouse CI | 每次 PR |
| JS 错误率 | Sentry | 实时，每小时汇总告警 |
| CD 部署状态 | Telegram Alerts | 每次部署 |
| Bundle Size | GitHub Actions | 每次 PR |
| DORA 指标 | DORA 度量工作流 | 每次部署 |

---

## 变更记录

| 日期 | 变更内容 | 原因 |
|------|---------|------|
| 2026-03-18 | 初始版本创建 | R-P2-05 SLO/SLA 定义落地，与后端 SLA 对齐 |
