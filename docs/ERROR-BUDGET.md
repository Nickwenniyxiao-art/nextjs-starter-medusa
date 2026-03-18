# Error Budget — NordHjem 前端

> 项目: NordHjem Frontend（Next.js + Medusa v2）
> 创建日期: 2026-03-18
> 关联文档: [docs/SLO-SLA.md](./SLO-SLA.md)
> 版本: 1.0.0

---

## 概述

Error Budget（错误预算）是基于 SLO 目标推算出的"允许失败空间"。它量化了在不违反服务承诺的前提下，系统可以发生多少故障或性能劣化。

---

## 前端 SLO 目标（摘自 SLO-SLA.md）

| SLO | 目标 | 测量周期 |
|-----|------|---------|
| 可用性 | 99.5% | 滚动 30 天 |
| LCP | ≤ 2.5s | 每次 PR（Lighthouse CI）|
| CLS | ≤ 0.1 | 每次 PR（Lighthouse CI）|
| INP | ≤ 200ms | 实时（Sentry）|
| 前端 JS 错误率 | < 0.5%/session | 实时（Sentry）|
| 核心业务流程成功率 | > 99% | 每 15 分钟（Playwright 巡检）|

---

## Error Budget 计算方式

### 可用性 Error Budget（每月）

```
可用性目标: 99.5%
月总分钟数: 30 天 × 24h × 60min = 43,200 分钟
允许宕机时间 = 43,200 × (1 - 0.995) = 216 分钟/月 ≈ 3.6 小时/月
```

| 指标 | 计算 | 结果 |
|------|------|------|
| 月允许宕机 | 43,200 × 0.5% | 216 分钟（≈ 3.6 小时）|
| 周允许宕机 | 10,080 × 0.5% | 50.4 分钟/周 |
| 日允许宕机 | 1,440 × 0.5% | 7.2 分钟/天 |

### JS 错误率 Error Budget

```
目标: < 0.5%/session
允许失败 session 数 = 每日 session 总数 × 0.5%
例：日均 1,000 sessions → 允许 5 个 error sessions/天
```

### Core Web Vitals Error Budget

Core Web Vitals 采用"合格率"计量：

```
LCP 合格率目标: ≥ 75% 的页面加载 LCP ≤ 2.5s
允许劣化页面: 25% 以内
```

---

## Error Budget 消耗追踪

| 月份 | 可用性 (实际 vs 目标) | 已消耗预算 | 剩余预算 | 状态 |
|------|---------------------|-----------|---------|------|
| 2026-03 | — | — | 216 min | 初始 |

> 数据来源: Playwright 巡检日志 + Sentry + Telegram 告警记录

---

## Error Budget 耗尽规则

### 触发条件

以下任一条件触发 Error Budget 耗尽告警：

1. **可用性 Error Budget 消耗 > 80%**（月内已用宕机 > 172 分钟）
2. **Core Web Vitals 持续劣化 > 48 小时**（LCP 或 CLS 连续超标超过 48h）
3. **前端 JS 错误率持续 > 1%（2× SLO 阈值）超过 2 小时**

### 开发暂停规则

**当 Error Budget 耗尽时，触发以下开发暂停规则**：

| 条件 | 执行动作 |
|------|---------|
| Core Web Vitals 持续劣化 > 48h | 暂停所有功能 PR 合并，只接受 `type: reliability` 标签的 PR |
| 可用性 Error Budget 消耗 > 80% | 暂停功能发布，优先处理稳定性修复 |
| 月 Error Budget 完全耗尽 | 冻结非 P0/P1 发布，启动 SLO 复查 |

**恢复条件**: 连续 24 小时 SLO 达标后，解除暂停限制。解除需在 DEPLOY-LOG.md 记录。

---

## 监控指标来源

| 指标 | 工具 | 查看位置 |
|------|------|---------|
| 可用性 / 核心流程成功率 | Playwright 巡检（每 15 分钟）| GitHub Actions → playwright-monitor |
| JS 错误率 | Sentry | Sentry Dashboard → Issues |
| Core Web Vitals（LCP/CLS/INP） | Lighthouse CI + Sentry | GitHub Actions → lighthouse-ci / Sentry Performance |
| Bundle Size | bundle-size-check workflow | GitHub Actions → bundle-size-check |
| CD 部署状态 | Telegram Alerts | Telegram Bot 通知 |

---

## 审查周期

- **每月一次**: 统计上月 Error Budget 消耗，写入本文档追踪表
- **每季度一次**: 审查 SLO 目标是否需要调整（参考 DORA 报告）

---

## 变更记录

| 日期 | 变更内容 | 原因 |
|------|---------|------|
| 2026-03-18 | 初始版本创建 | 卓越框架 v5.0 补全 |
