# Stripe 配置指南（Test Mode）

本文档说明如何在本项目中完成 Stripe 测试环境配置，包括前端环境变量、Stripe 测试密钥获取、Medusa 后端 Stripe Provider 配置以及常见问题排查。

## 1. 开启 Stripe Test Mode

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)。
2. 在左下角或顶部区域开启 **Test mode**（测试模式）。
3. 确认页面中出现“Viewing test data”或类似提示。

> 建议开发、联调和 QA 阶段始终使用 Test Mode，避免真实扣款。

## 2. 获取 `pk_test_` 和 `sk_test_`

在 Stripe Test Mode 下：

1. 进入 **Developers → API keys**。
2. 找到以下两个 key：
   - **Publishable key**：以 `pk_test_` 开头（前端使用）
   - **Secret key**：以 `sk_test_` 开头（仅后端使用，严禁暴露到前端）
3. 若看不到完整 Secret key，点击 Reveal test key 显示。

### 使用建议

- 将 `pk_test_` 填入前端环境变量 `NEXT_PUBLIC_STRIPE_KEY`。
- 将 `sk_test_` 配置到 Medusa 后端 Stripe Provider 配置（见下文）。
- 切勿把 `sk_test_` 写入前端 `.env` 或提交到仓库。

## 3. 前端环境变量配置

1. 复制仓库根目录下的 `.env.template` 为 `.env.local`（或你的本地环境文件）。
2. 按需填写：

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
NEXT_PUBLIC_CRISP_WEBSITE_ID=
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

## 4. Medusa 后端 Stripe Provider 配置

以下为通用配置思路（不同 Medusa 版本字段可能略有差异）：

1. 安装并启用 Stripe 支付 provider（例如 `@medusajs/medusa/payment-stripe` 或项目当前使用的 Stripe 插件）。
2. 在 Medusa 后端配置文件（通常是 `medusa-config.ts`）中注册 Stripe provider。
3. 在后端环境变量中设置：
   - `STRIPE_API_KEY=sk_test_xxx`
   - （可选）Webhook secret、自动捕获等参数
4. 重启 Medusa 后端服务。

示例（伪代码，仅示意）：

```ts
modules: [
  {
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/payment-stripe",
          id: "stripe",
          options: {
            api_key: process.env.STRIPE_API_KEY,
          },
        },
      ],
    },
  },
]
```

> 注意：`sk_test_` 必须只存在于后端环境变量中，不可暴露到浏览器。

## 5. Stripe 测试卡号

以下测试卡仅可在 Test Mode 使用：

- **支付成功**：`4242 4242 4242 4242`
- **支付被拒**：`4000 0000 0000 0002`
- **需要 3D Secure 验证**：`4000 0025 0000 3155`

通用输入建议：

- 到期日：任意未来日期（如 `12/34`）
- CVC：任意 3 位（如 `123`）
- 邮编：任意有效格式

## 6. 常见问题排查（Troubleshooting）

### 6.1 前端报错：`Invalid API Key provided`

- 检查 `NEXT_PUBLIC_STRIPE_KEY` 是否以 `pk_test_` 开头。
- 确认未误填 `sk_test_` 到前端变量。
- 修改环境变量后重启前端服务。

### 6.2 下单时报支付 provider 不可用

- 确认 Medusa 后端已正确启用 Stripe provider。
- 检查后端环境变量 `STRIPE_API_KEY` 是否存在且为 `sk_test_`。
- 查看后端启动日志是否有 provider 初始化错误。

### 6.3 结账页面无法拉起 Stripe Elements

- 检查 `NEXT_PUBLIC_STRIPE_KEY` 是否为空。
- 检查浏览器控制台是否有跨域（CORS）或网络请求失败。
- 确认 `NEXT_PUBLIC_MEDUSA_BACKEND_URL` 指向可访问的 Medusa 服务。

### 6.4 Webhook 相关异常

- 确认 Webhook endpoint 配置的签名密钥与后端一致。
- 确认 Stripe Dashboard 中的 endpoint 指向当前后端可访问地址。
- 本地开发可用 Stripe CLI 转发事件并辅助调试。

---

如需切换到生产环境，请将所有 `*_test_*` 密钥替换为 live 密钥，并重新检查日志、Webhook、回调地址与风控配置。
