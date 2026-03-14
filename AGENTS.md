# AGENTS.md — NordHjem Frontend

## Project Overview
NordHjem is a Scandinavian furniture e-commerce platform.
This is the storefront, powered by **Next.js 15** + **Medusa.js v2 SDK**.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode)
- Package Manager: Yarn 4 (Berry) with PnP disabled (node_modules mode)
- Styling: Tailwind CSS
- State/Data: Medusa JS SDK + React Query
- Deployment: PM2 on VPS (not Vercel)

## Project Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── [countryCode]/ # Localized routes
│   └── api/          # API routes
├── lib/              # Utilities, SDK config, constants
├── modules/          # Feature modules (layout, products, cart, etc.)
└── types/            # TypeScript type definitions
```

## Key Conventions
- Pages use App Router conventions (`page.tsx`, `layout.tsx`)
- Country code routing: `/[countryCode]/...` for i18n
- Server Components by default; use `"use client"` only when needed
- Medusa SDK initialized in `src/lib/config.ts`
- All API calls go through Medusa SDK (not raw fetch)
- Publishable API Key is set via `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

## Branch Strategy
- `develop` → `staging` → `main`
- All changes via feature branches → PR to `develop`
- Branch naming: `codex/*` for AI-generated, `feature/*` for manual
- PR titles must use Conventional Commits (feat/fix/refactor/chore)

## CI/CD
- CI: yarn install → lint → type-check → build on PR/push
- CD: develop auto-deploys to test → staging auto-deploys → main needs approval for production
- Required checks: `lint-and-build` + `ai-review-gate` + all governance gates (see below)

## CI Gate 规则

### Issue 规范
- 每个 Issue 必须有 `type:` 前缀标签（type: task / type: feature / type: bug）
- 每个 Issue 必须有 `approved` 标签才能开发
- PR 必须在 body 中包含 `Closes #<issue_number>` 关联 Issue

### PR 规范
- **分支命名**：`<type>/<description>`（如 `feat/add-search`, `codex/42-fix-cart`）
- **PR 标题**：必须符合 Conventional Commits（`feat(scope): description`）
- **Commit 消息**：必须符合 Conventional Commits
- **Assignee**：每个 PR 必须有至少一个 assignee
- **豁免**：带 `no-issue` 或 `hotfix` 标签的 PR 可跳过 Issue 关联检查

### 自动化流程
1. PR 创建 → 自动启用 auto-merge（squash）
2. CI gates 全部通过 → AI Review 通过 → Bot 自动 approve
3. Branch Protection 所有 required checks 通过 → 自动合并
4. staging 分支不需要审批，production 分支需要 Owner 审批

## Environments
| Env | FE Port | BE Port | Backend URL |
|-----|---------|---------|-------------|
| Test | 8001 | 9001 | http://localhost:9001 |
| Staging | 8002 | 9002 | http://localhost:9002 |
| Production | 8000 | 9000 | http://localhost:9000 |

## Do NOT
- Hardcode backend URLs (use `NEXT_PUBLIC_MEDUSA_BACKEND_URL`)
- Use `yarn install` in CI without `--immutable` (use frozen lockfile)
- Modify `.github/workflows/` without explicit instruction
- Add `"use client"` to components that don't need interactivity
- Commit `.env` files
- Create PR without linked Issue (unless `no-issue` or `hotfix` label)
- Start development before Issue has `approved` label
