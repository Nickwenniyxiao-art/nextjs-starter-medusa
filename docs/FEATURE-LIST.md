# NordHjem 前端功能清单 (FEATURE-LIST)

> 版本: 1.0
> 最后更新: 2026-03-18
> 状态: Active
> 说明: 所有 PR 改动的模块必须在此清单中存在。新增功能必须先更新此文档并经 Owner 批准。

## 功能状态说明
- ✅ 已上线 (production)
- 🔄 开发中 (in-progress)
- ⏳ 计划中 (planned)
- ⏸️ 暂缓 (deferred)
- ❌ 已取消 (cancelled)

---

## M1 — 商品目录 (product-catalog)
**状态**: ✅ 已上线
**模块路径**: `src/modules/product-catalog`, `src/app/[countryCode]/store`
**描述**: 商品列表页、分类浏览、搜索过滤

### 功能点
- F-M1-01: 商品列表展示（分页）✅
- F-M1-02: 商品分类筛选 ✅
- F-M1-03: 商品搜索 ✅
- F-M1-04: 商品排序（价格/新品）✅

---

## M2 — 商品详情 (product-detail)
**状态**: ✅ 已上线
**模块路径**: `src/modules/products`, `src/app/[countryCode]/products`
**描述**: 商品详情页、图片画廊、SKU 选择

### 功能点
- F-M2-01: 商品详情展示 ✅
- F-M2-02: 图片画廊 ✅
- F-M2-03: SKU/规格选择 ✅
- F-M2-04: 商品推荐 ⏳

---

## M3 — 购物车 (cart)
**状态**: ✅ 已上线
**模块路径**: `src/modules/cart`
**描述**: 购物车管理、数量调整、商品移除

### 功能点
- F-M3-01: 添加商品到购物车 ✅
- F-M3-02: 修改数量 ✅
- F-M3-03: 移除商品 ✅
- F-M3-04: 购物车持久化 ✅

---

## M4 — 结账流程 (checkout)
**状态**: 🔄 开发中 (~95%)
**模块路径**: `src/modules/checkout`
**描述**: 多步骤结账流程

### 功能点
- F-M4-01: 收货地址填写 ✅
- F-M4-02: 配送方式选择 ✅
- F-M4-03: 支付方式选择 ✅
- F-M4-04: 订单确认 ✅
- F-M4-05: Stripe Live Mode 集成 🔄

---

## M5 — 用户账户 (account)
**状态**: 🔄 开发中 (~92%)
**模块路径**: `src/modules/account`
**描述**: 用户注册、登录、个人资料管理

### 功能点
- F-M5-01: 用户注册 ✅
- F-M5-02: 用户登录/登出 ✅
- F-M5-03: 个人资料编辑 ✅
- F-M5-04: 邮箱变更验证 🔄
- F-M5-05: 密码修改 ✅

---

## M6 — 订单管理 (order)
**状态**: 🔄 开发中 (~92%)
**模块路径**: `src/modules/order`
**描述**: 订单历史、订单详情、订单状态追踪

### 功能点
- F-M6-01: 订单历史列表 ✅
- F-M6-02: 订单详情 ✅
- F-M6-03: 订单状态追踪 ✅
- F-M6-04: 边缘场景处理 🔄

---

## M7 — 支付系统 (payment)
**状态**: 🔄 开发中 (~95%)
**模块路径**: `src/modules/checkout/components/payment`
**描述**: Stripe 支付集成

### 功能点
- F-M7-01: Stripe Elements 集成 ✅
- F-M7-02: 支付成功处理 ✅
- F-M7-03: 支付失败处理 ✅
- F-M7-04: Stripe Live Mode ⏳

---

## M8 — SEO 基础 (seo)
**状态**: 🔄 开发中 (~85%)
**模块路径**: `src/app`, `next-sitemap.js`
**描述**: Meta 标签、Sitemap、结构化数据

### 功能点
- F-M8-01: 页面 Meta 标签 ✅
- F-M8-02: XML Sitemap ✅
- F-M8-03: 结构化数据 (JSON-LD) 🔄
- F-M8-04: Open Graph 标签 ✅

---

## M9 — 合规安全 (compliance)
**状态**: 🔄 开发中 (~85%)
**模块路径**: `src/modules/common`
**描述**: Cookie Consent、GDPR 合规

### 功能点
- F-M9-01: Cookie Consent Banner ✅
- F-M9-02: GDPR 数据处理声明 🔄
- F-M9-03: 隐私政策页面 ✅

---

## M10 — 多品牌扩展 (multi-brand)
**状态**: ⏳ 计划中 (40%)
**模块路径**: `src/modules/common/components/brand`
**描述**: 品牌切换、主题系统

### 功能点
- F-M10-01: 品牌配置系统 🔄
- F-M10-02: 主题切换 ⏳
- F-M10-03: 品牌特定内容 ⏳

---

## M11 — 国际化 (i18n)
**状态**: ⏳ 计划中 (0%)
**模块路径**: `src/i18n`
**描述**: 多语言支持

### 功能点
- F-M11-01: next-intl 集成 ⏳
- F-M11-02: 语言切换 ⏳
- F-M11-03: 内容翻译 ⏳

---

## 变更记录

| 日期 | 变更内容 | 变更类型 | 批准 |
|------|---------|---------|------|
| 2026-03-18 | 初始版本创建 | 新建 | ✅ Owner |
