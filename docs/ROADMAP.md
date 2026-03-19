# NordHjem 前端开发路线图

> ⚠️ 本文档经 Owner 确认后锁定。CTO 不得自行修改。变更必须走流程：提出理由 → Owner 审批 → 更新并记录原因。

## 状态图例

- ✅ 已完成
- 🔄 进行中
- ⏳ 待开始
- ⏸️ 延后

---

## Phase 0: 基础设施整改 ✅

### P0 紧急修复

| ID | 任务 | 状态 | 完成日期 | 说明 |
|----|------|------|---------|------|
| R-P0-01 | AI Review extract-diff bug 修复 | ✅ | 2026-03-13 | AI Review 提取差异修复 |
| R-P0-02 | Branch Protection reviewer=1 | ✅ | 2026-03-13 | 前后端都已配置 |
| R-P0-03 | Auto-merge CD_PAT | ✅ | 2026-03-13 | 使用 CD_PAT 替代 GITHUB_TOKEN |

### P1 代码质量基础

| ID | 任务 | 状态 | 完成日期 | 说明 |
|----|------|------|---------|------|
| R-P0-04 | 前端 ESLint + Next.js lint | ✅ | 2026-03-13 | next lint 集成 |
| R-P0-05 | 前端 CI lint + type-check | ✅ | 2026-03-13 | CI yarn lint + tsc --noEmit |
| R-P0-06 | Husky + lint-staged + commitlint | ✅ | 2026-03-13 | Git hooks 配置 |
| R-P0-07 | AGENTS.md | ✅ | 2026-03-13 | 项目说明文档 |
| R-P0-08 | 前端 CI frozen lockfile | ✅ | 2026-03-13 | yarn --frozen-lockfile |
| R-P0-09 | Production admin bypass disabled | ✅ | 2026-03-13 | 禁止管理员绕过 |
| R-P0-10 | TypeScript strict mode | ⏸️ | — | 延后，历史代码 any 类型太多（ADR-006） |

---

## Phase 1: 质量与安全加固 ✅

> 目标：补齐测试、安全扫描、AI Review 完整能力

| ID | 任务 | 优先级 | 状态 | 依赖 | 说明 |
|----|------|--------|------|------|------|
| R-P1-01 | 前端单元测试框架搭建（Vitest） | P1 | ✅ | — | Vitest + @testing-library/react（2026-03-17） |
| R-P1-02 | CI 加 yarn audit 安全扫描 | P1 | ✅ | — | audit-level=high（2026-03-17） |
| R-P1-03 | E2E 加 WebKit 浏览器 | P2 | ✅ | — | Playwright 多浏览器（2026-03-17） |
| R-P1-04 | AI Reviewer 2 (Claude) 启用 | P2 | ✅ | ANTHROPIC_API_KEY | 安全审查（2026-03-17） |
| R-P1-05 | AI Reviewer 3 (架构审查) 启用 | P3 | ✅ | Reviewer 2 完成 | 架构一致性审查（2026-03-17） |
| R-P1-06 | Production Smoke Test | P2 | ✅ | — | 核心业务流程验证（2026-03-17） |
| R-P1-07 | Playwright 巡检频率调整 | P2 | ✅ | — | 2小时→15分钟（2026-03-17） |
| R-P1-08 | Sentry 性能监控完善 | P2 | ✅ | — | 前端 Sentry 性能指标（2026-03-17） |
| R-P1-09 | CI Gate v2 (Bot auto-approve) | P1 | ✅ | — | PR 自动审批门禁 |
| R-P1-10 | CI Gate: Issue 标签 + PR 元数据检查 | P1 | ✅ | — | 治理门禁 |
| R-P1-11 | ROADMAP 追溯机制 | P1 | ✅ | — | ROADMAP Ref + check-roadmap-ref.yml |
| R-P1-24 | 原子化执行保障体系 (EGP) | P0 | ✅ | — | TASK-REGISTRY + CI 门禁（2026-03-18） |

---

## Phase 1.5: Phase 1 遗留收尾 🔄

> Phase 1（功能开发）中未达 100% 的模块收尾

| ID | 模块 | 名称 | 当前进度 | 目标 | 说明 |
|----|------|------|---------|------|------|
| R-P1-12 | M3 | 结账流程 | ~95% | 100% | 需等 Stripe Live Mode |
| R-P1-13 | M4 | 订单管理 | 92% | 100% | 边缘场景处理 |
| R-P1-14 | M5 | 退款系统 | ~95% | 100% | 需等 Stripe Live Mode |
| R-P1-15 | M6 | 用户账户 | 92% | 100% | 邮箱变更验证 |
| R-P1-16 | M9 | 支付系统 | ~95% | 100% | 需等 Stripe Live Mode |
| R-P1-17 | M16a | SEO 基础 | 85% | 95% | Sitemap + 结构化数据 |
| R-P1-18 | M18a | 安全合规基础 | 85% | 95% | Cookie Consent + GDPR |

---

## Phase 2: 监控与运维完善 ✅

> 目标：建立完整的可观测性和告警体系

| ID | 任务 | 优先级 | 状态 | 说明 |
|----|------|--------|------|------|
| R-P2-01 | DORA 度量工作流 | P1 | ✅ | 部署频率/变更失败率跟踪（2026-03-17） |
| R-P2-02 | Lighthouse CI | P2 | ✅ | Core Web Vitals 自动化检测 |
| R-P2-03 | Bundle Size 检查 | P2 | ✅ | 前端包大小门禁 |
| R-P2-04 | Sentry 告警接入 | P2 | ✅ | Telegram 告警 + GitHub Issue 自动创建（2026-03-18） |
| R-P2-05 | SLO/SLA 定义 | P3 | ✅ | 可用性 99.5%，Core Web Vitals SLO，与后端对齐（2026-03-18） |

---

## Phase 3: 功能开发 ⏳

> 目标：完善电商核心功能，扩展品牌和运营能力

| ID | 模块 | 名称 | 当前进度 | 优先级 | 依赖 | 说明 |
|----|------|------|---------|--------|------|------|
| R-P3-01 | M15 | 多品牌扩展 | 40% | P1 | — | 前端品牌切换 + 主题系统 |
| R-P3-02 | M16b | 高级 SEO | 0% | P2 | M16a 完成 | 结构化数据、XML Sitemap 扩展 |
| R-P3-03 | M17 | 国际化 i18n | 0% | P2 | — | 多语言支持、next-intl |
| R-P3-04 | M19 | 营销系统 | 0% | P3 | — | 促销、折扣码前端展示 |
| R-P3-05 | M20 | CMS 内容管理 | 0% | P3 | — | 博客、Landing Page |

---

## Phase 4: 优化与扩展 ⏳

> 目标：高级功能、外部集成、AI 驱动运营

| ID | 模块 | 名称 | 当前进度 | 优先级 | 说明 |
|----|------|------|---------|--------|------|
| R-P4-01 | M18b | 高级安全合规 | 0% | P2 | GDPR 深度合规、数据加密 |
| R-P4-02 | M21 | 社媒集成 | 0% | P2 | Instagram/Pinterest 产品展示 |
| R-P4-03 | — | 性能优化 | — | P2 | Core Web Vitals、CDN、ISR |
| R-P4-04 | — | Feature Flags | — | P3 | 渐进式发布机制 |
| R-P4-05 | M23 | AI 个性化推荐 | 0% | P3 | 智能产品推荐前端组件 |

---

## 变更日志

| 日期 | 变更内容 | 原因 | Owner 审批 |
|------|---------|------|------------|
| 2026-03-13 | 初始版本创建 | 建立开发管理体系 | ✅ 已锁定 |
| 2026-03-17 | 增加 Phase 1 完成状态 | CI Gate + 测试框架落地 | ✅ Owner 已批准 |
| 2026-03-18 | 增加 R-P1-24 EGP 体系 | 原子化执行保障体系实施 | ✅ Owner 已批准 |
| 2026-03-18 | Phase 2 收尾：R-P2-04/05 | Sentry 告警接入 + SLO/SLA 定义落地，Phase 2 完成 | ✅ Owner 已批准 |
