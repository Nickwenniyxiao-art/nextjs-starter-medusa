# DORA Metrics Report（前端）

本文件定义前端仓库 DORA（DevOps Research and Assessment）四项指标的自动化采集方式与解读口径。

## 指标采集方式

- 工作流：`.github/workflows/dora-metrics.yml`
- 触发频率：每周一 `08:00 UTC`（支持 `workflow_dispatch` 手动触发）
- 统计窗口：过去 7 天

### 1) Deployment Frequency（部署频率）

- 数据源：`cd-production.yml` 工作流最近 7 天 `completed` 的运行记录
- 口径：生产部署运行总次数

### 2) Lead Time for Changes（变更前置时间）

- 数据源：成功的 `cd-production.yml` 运行 + 该次部署 `head_sha` 关联 PR
- 口径：PR `merged_at` 到部署运行 `updated_at` 的平均小时数
- 说明：若部署 SHA 关联不到已合并 PR，则该次样本不计入均值

### 3) Change Failure Rate（变更失败率）

- 数据源：`cd-production.yml` 最近 7 天 `completed` 运行
- 口径：`failure / total * 100%`

### 4) Mean Time to Restore（服务恢复时间）

- 数据源：最近 7 天关闭、且带 `incident` label 的 Issue
- 口径：Issue `created_at` 到 `closed_at` 的平均小时数

## 输出位置

- GitHub Actions Job Summary（每次运行输出本周指标）
- Actions 日志（console）

## 解释与限制

- 当前采用 workflow run 与 issue label 的轻量口径，便于零侵入落地。
- 若后续需要更高精度，可增加：
  - 环境级 deployment event API（含部署状态与环境元数据）
  - incident 分类标准化（优先级、严重级别）
  - 指标持久化（写入文档/数据仓库用于趋势看板）
