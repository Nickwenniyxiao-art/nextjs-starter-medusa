# NordHjem Storefront 架构说明

## 技术架构

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│    Nginx     │────▶│   Next.js    │
│   (用户)    │     │  (反向代理)   │     │  (PM2:8000)  │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                                         ┌──────▼───────┐
                                         │  Medusa API  │
                                         │  (port 9000) │
                                         └──────────────┘
```

## 页面结构 (App Router)

- `/` — 首页 (Hero + 精选产品)
- `/store` — 商品列表
- `/products/[handle]` — 商品详情
- `/cart` — 购物车
- `/checkout` — 结账
- `/account` — 用户中心

## 国际化

- 使用 `next-intl`，支持 en / zh / da
- 翻译文件在 `messages/` 目录
- URL 路由自动带语言前缀

## 部署

详见根目录 `deploy_frontend.sh` 脚本和 `docs/runbook.md` 故障手册。

## 环境变量

详见 `.env.template`。
