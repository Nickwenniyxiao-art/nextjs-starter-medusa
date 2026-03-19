# AI-CONTEXT — NordHjem 前端项目上下文包

> 本文档是 AI Agent 启动时的标准读取入口。
> 首次参与本项目的 AI Agent 必须先完整阅读本文档，再开始任何工作。
> 版本: 1.0.0 | 最后更新: 2026-03-18

---

## 项目简介

**NordHjem** 是一个北欧风格的电商平台，本仓库为**前端 Store**。

- 技术基础: Next.js 14（App Router）+ Medusa v2 后端 API
- 部署平台: Vercel（生产）/ Railway（备用）
- 国际化: next-intl，支持 en / zh / da
- 当前阶段: 生产就绪阶段（Phase 2 进行中，卓越框架 v5.0）

---

## 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Next.js 14（App Router，TypeScript）|
| UI | Tailwind CSS |
| 国际化 | next-intl |
| 状态/数据 | Medusa JS SDK（REST API）|
| 支付 | Stripe（通过 Medusa 集成）|
| 单元测试 | Vitest + Testing Library |
| E2E 测试 | Playwright |
| 性能监控 | Lighthouse CI（每次 PR）|
| 错误监控 | Sentry（错误率 + Core Web Vitals）|
| 包大小检查 | bundle-size-check workflow（gzip ≤ 500KB）|
| CI/CD | GitHub Actions |
| 代码规范 | ESLint + commitlint + Husky |

---

## 分支策略

```
feature/* ──┐
fix/*    ──▶  develop  ──▶  staging  ──▶  main (production)
chore/*  ──┘
```

- `develop`: 日常开发合并目标，所有 feature/fix PR 必须以此为 base
- `staging`: 从 develop 自动部署，用于 QA 和 PRR 验证
- `main`: 生产分支，只接受来自 staging 的 promote PR，Owner 必须 Approve

**严禁直接 push main 或绕过 PR 流程。**

---

## 当前开发阶段

- **Phase 0**: 基础设施整改 — 完成
- **Phase 1**: 代码质量 + CI 门禁 — 完成
- **Phase 2**: 生产就绪（SLO 监控 + 告警 + 文档治理）— 进行中
- **Phase 3**: 功能迭代（商品、购物车、结账优化）— 待开始

详见: `docs/ROADMAP.md`

---

## 关键文档路径

| 文档 | 路径 | 说明 |
|------|------|------|
| 路线图 | `docs/ROADMAP.md` | 所有阶段和任务的权威来源 |
| 功能列表 | `docs/FEATURE-LIST.md` | 功能定义与验收标准 |
| 任务注册表 | `docs/TASK-REGISTRY.json` | 细粒度 Action 进度追踪 |
| 测试注册表 | `docs/TEST-REGISTRY.json` | 测试脚本与功能/Bug 映射 |
| 文档注册表 | `DOC-REGISTRY.json` | 所有文档的注册清单 |
| SLO/SLA | `docs/SLO-SLA.md` | 可用性目标与响应时限 |
| Error Budget | `docs/ERROR-BUDGET.md` | 错误预算计算与开发暂停规则 |
| 架构说明 | `docs/architecture.md` | 系统架构与页面结构 |
| Runbook | `docs/runbook.md` | 运维操作手册 |
| PRR | `docs/PRR.md` | 生产就绪评审清单 |
| RFC 目录 | `docs/RFC/` | 重要技术决策文档 |
| 部署日志 | `docs/DEPLOY-LOG.md` | 每次部署记录 |
| 当前状态 | `CURRENT-STATUS.md` | 最新进展与阻塞记录 |

---

## CI/CD 规则摘要

### PR 必须满足的条件（develop 分支）

1. **关联 approved Issue**: PR body 必须包含 `Closes #xxx`，且该 Issue 有 `approved` label（由 `pr-compliance-gate` 检查）
2. **commitlint 通过**: commit 消息必须符合 Conventional Commits 格式
3. **CI 通过**: lint + type-check + Vitest 单元测试全部绿灯
4. **Bundle Size 不超标**: gzip ≤ 500KB
5. **Lighthouse CI 通过**: LCP ≤ 2.5s / CLS ≤ 0.1
6. **文档门禁**: 新增 docs/ 文件必须注册到 `DOC-REGISTRY.json`
7. **Bug 修复 PR**: 必须包含回归测试文件（.spec.ts / .test.ts）

### 自动化工作流

| 工作流 | 触发条件 | 说明 |
|--------|---------|------|
| ci.yml | PR → develop | lint + type-check + vitest |
| lighthouse-ci.yml | PR | Core Web Vitals 检查 |
| bundle-size-check.yml | PR | JS Bundle 大小检查 |
| pr-compliance-gate.yml | PR → develop | linked issue approved 检查 |
| check-registry-integrity.yml | TASK-REGISTRY.json 变更 | 注册表完整性校验 |
| doc-registry-check.yml | docs/** 变更 | 野文档检查 |
| check-test-coverage.yml | PR（bug 标签）| 回归测试要求 |
| playwright-monitor.yml | 每 6 小时 | 生产环境巡检 |
| sentry-alert-monitor.yml | 每小时 | Sentry 错误率巡检 |
| alert-on-failure.yml | CI/CD 失败 | 自动创建 GitHub Issue |
| cd-production.yml | push main | 生产部署 |

---

## 禁止事项

以下行为 AI Agent 不得执行，必须停下来向 Owner 确认：

1. **不能直接 push main 分支**（必须走 PR + Owner Approve）
2. **不能绕过文档门禁**（新文档必须注册到 DOC-REGISTRY.json）
3. **不能跳过 Issue approved 检查**（功能开发必须有 approved Issue 对应）
4. **不能修改 ROADMAP.md**（必须由 Owner 批准后修改）
5. **不能在无 RFC 的情况下进行架构级变更**（见 `docs/RFC/README.md`）
6. **不能跳过 PRR**（生产发布前必须完成 `docs/PRR.md` 填写）
7. **不能在 Error Budget 耗尽时合并功能 PR**（见 `docs/ERROR-BUDGET.md`）
8. **不能绕过 CI 门禁**（不得使用 `--no-verify` 或强制合并）

---

## 快速上手检查清单

AI Agent 开始工作前，请确认：

- [ ] 已阅读 `docs/ROADMAP.md`，了解当前阶段
- [ ] 已阅读 `docs/FEATURE-LIST.md`，了解功能范围
- [ ] 已查阅 `docs/TASK-REGISTRY.json`，找到当前任务的 Action ID
- [ ] 已查阅 `CURRENT-STATUS.md`，了解最新阻塞情况
- [ ] 开发完成后更新 TASK-REGISTRY.json + TEST-REGISTRY.json + DOC-REGISTRY.json

---

> 生成工具: AI Agent | 项目: NordHjem Frontend | 日期: 2026-03-18
