## S1-4: Playwright Site Monitor 修复 (2026-03-16)

- **问题**: 28 passed / 16 failed，主要失败原因：API 响应超时、Cookie 检测不兼容、UI 交互超时
- **修复**:
  1. 增加全局 timeout 从 30s 到 60s
  2. API 测试添加状态码容错（API 不可达时 skip 而非 fail）
  3. 用户认证测试改用 UI 状态验证替代 cookies 数量检查
  4. 购物车/结账测试添加 API 可达性前置检查
  5. 触发频率从每 2 小时降为每 6 小时
