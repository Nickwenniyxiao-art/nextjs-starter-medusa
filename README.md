# NordHjem Storefront

NordHjem 北欧电商平台前端，基于 [Next.js 14](https://nextjs.org/) + [Medusa.js v2 Storefront](https://docs.medusajs.com/storefront) 构建。

## 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 国际化 | next-intl (en / zh / da) |
| 包管理 | Yarn 4 (Corepack) |
| CI | GitHub Actions (build-and-check) |
| 部署 | PM2 (port 8000) + Nginx 反向代理 |

## 目录结构

```
nextjs-starter-medusa/
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── modules/          # 业务模块组件
│   ├── lib/              # 工具函数、API 客户端
│   └── styles/           # 全局样式
├── messages/             # i18n 翻译文件 (en.json / zh.json / da.json)
├── public/               # 静态资源
├── docs/                 # 项目文档
├── .github/workflows/    # CI 配置
├── deploy_frontend.sh    # 标准化部署脚本
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind 配置
├── .env.example          # 环境变量模板
├── .env.template         # 完整环境变量说明
└── README.md
```

## 快速开始

### 前置条件

- Node.js >= 20
- Corepack 已启用 (`corepack enable`)
- 后端 Medusa 服务运行中

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa.git
cd nextjs-starter-medusa

# 2. 复制环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际值

# 3. 安装依赖
corepack enable
yarn install

# 4. 启动开发服务器
yarn dev
```

访问 http://localhost:8000

### 生产部署

```bash
# 使用标准化部署脚本
./deploy_frontend.sh              # 部署 main 最新代码
./deploy_frontend.sh <commit>     # 部署指定版本
```

部署脚本自动执行：拉代码 → 安装依赖 → 构建 → 重启 PM2 → 健康检查 → 失败自动回滚。

## 环境变量

详见 `.env.template`，主要配置项：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | 后端 API 地址 |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa 可发布密钥 |
| `NEXT_PUBLIC_BASE_URL` | 前端访问地址 |
| `NEXT_PUBLIC_DEFAULT_REGION` | 默认区域 (dk) |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe 公钥 |

## CI/CD

- **CI**: GitHub Actions — 每次 PR / push 到 `main` 自动执行 install → lint → typecheck → build
- **CD**: 通过 `deploy_frontend.sh` 脚本执行
- **分支保护**: 必须 CI 通过 + 1 名 Reviewer 批准才能合并

## 国际化

支持三种语言，翻译文件在 `messages/` 目录：
- `en.json` — English
- `zh.json` — 中文
- `da.json` — Dansk

## 相关仓库

- 后端 Medusa: [nordhjem-medusa-backend](https://github.com/Nickwenniyxiao-art/nordhjem-medusa-backend)
