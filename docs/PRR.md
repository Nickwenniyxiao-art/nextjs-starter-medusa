# 生产就绪评审 (Production Readiness Review)

> 项目: NordHjem 前端（Next.js + Medusa v2）
> 模板版本: 1.0.0
> 创建日期: 2026-03-18

---

> **使用说明**: 每次将功能从 staging 推进到 production 前，由 AI Agent 填写本文档，提交 promote PR 后由 Owner 评审。Owner Approve PR = 批准生产发布。

---

## 基本信息

> 功能/模块: [Module Name]
> 评审日期: [YYYY-MM-DD]
> 负责 AI: [AI Agent]
> 对应 Task: [R-Px-xx]
> Owner 批准: [ ] 待批准

---

## 功能就绪

- [ ] 功能与 `docs/FEATURE-LIST.md` 中的定义一致
- [ ] 所有验收标准已通过测试
- [ ] 变更记录完整（DEPLOY-LOG.md 已更新）
- [ ] Staging 环境已验证，功能行为符合预期

## 可观测性

- [ ] Sentry 错误监控已配置，新模块/路由已覆盖
- [ ] Core Web Vitals 未劣化（LCP ≤ 2.5s / CLS ≤ 0.1 / INP ≤ 200ms）
- [ ] Lighthouse CI 报告已查阅，性能分数无明显下滑
- [ ] 关键业务事件已埋点（如加购、结账成功）

## 测试覆盖

- [ ] 单元测试通过（Vitest，相关模块覆盖率 ≥ 80%）
- [ ] E2E 测试通过（Playwright，核心流程：首页 → 商品 → 加购 → 结账）
- [ ] 回归测试通过（未破坏现有功能）
- [ ] Bundle Size 未超预算（gzipped ≤ 500KB，由 bundle-size-check 验证）
- [ ] 安全扫描通过（yarn audit，无 high/critical 漏洞）

## 运维准备

- [ ] `docs/runbook.md` 已更新（包含新功能相关的运维场景）
- [ ] 回滚方案明确：Vercel instant rollback 可执行
- [ ] Feature Flag 已配置（如适用）
- [ ] 环境变量已同步到 Production（`.env` 变更已通过 sync-env-data workflow）
- [ ] 无数据迁移风险（或迁移脚本已在 staging 测试通过）

## 文档完整性

- [ ] 相关模块设计文档已更新（`docs/architecture.md` 或模块文档）
- [ ] `docs/FEATURE-LIST.md` 功能状态已更新为 `shipped`
- [ ] `docs/TASK-REGISTRY.json` 对应 Action 状态已更新为 `done`
- [ ] `docs/TEST-REGISTRY.json` 已记录新增测试
- [ ] `DOC-REGISTRY.json` 已更新（如新增文档）
- [ ] `docs/DEPLOY-LOG.md` 已记录本次发布

## 性能预算核查

| 指标 | 目标 | 当前值 | 通过？ |
|------|------|--------|--------|
| LCP | ≤ 2.5s | — | [ ] |
| CLS | ≤ 0.1 | — | [ ] |
| INP | ≤ 200ms | — | [ ] |
| TTFB | ≤ 800ms | — | [ ] |
| JS Bundle (gzip) | ≤ 500KB | — | [ ] |
| 前端错误率 | < 0.5% | — | [ ] |

## Owner 确认

> 以上检查项全部完成后，Owner 在 GitHub 上 Approve promote PR 即视为批准生产发布。

## 已知风险与缓解措施

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| — | — | — | — |

---

> 模板来源: `docs/templates/PRR.md` | 适配版本: NordHjem Frontend v1.0
