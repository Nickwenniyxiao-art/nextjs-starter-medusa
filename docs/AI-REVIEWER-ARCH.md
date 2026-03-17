# AI Reviewer 3 架构审查配置

> 状态: stub | 最后更新: 2026-03-17

## 概述

AI Code Review 工作流的第三审查器，专注于前端架构一致性检查。

## 审查维度

- Next.js 模式规范
- 目录结构与组件划分
- 状态管理合理性
- 性能模式合规
- 样式约定一致性

## 配置

- 工作流: `.github/workflows/ai-review.yml`
- API: Perplexity Sonar
- Secret: `PERPLEXITY_API_KEY`
