#!/usr/bin/env bash
# ============================================================
# deploy_frontend.sh — NordHjem Storefront 前端部署脚本
# 遵循 ENG-GOV-001 §3.3 部署流程要求
# 用法: ./deploy_frontend.sh [commit_hash|tag]
# ============================================================
set -euo pipefail

# ── 配置 ──────────────────────────────────────────────────────
APP_DIR="/opt/nordhjem/storefront"
REPO_URL="https://github.com/Nickwenniyxiao-art/nextjs-starter-medusa.git"
PM2_NAME="storefront"
LOG_FILE="/var/log/nordhjem/deploy_frontend.log"
HEALTH_URL="http://127.0.0.1:8000"
MAX_RETRIES=30
RETRY_INTERVAL=2

# ── 日志函数 ──────────────────────────────────────────────────
log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S UTC')] [DEPLOY-FE] $1"
  echo "$msg"
  mkdir -p "$(dirname "$LOG_FILE")"
  echo "$msg" >> "$LOG_FILE"
}

# ── 参数解析 ──────────────────────────────────────────────────
TARGET_REF="${1:-main}"
DEPLOYER="${DEPLOYER:-$(whoami)}"

log "========================================="
log "开始前端部署"
log "操作者: $DEPLOYER"
log "目标版本: $TARGET_REF"
log "========================================="

# ── 1. 拉取最新代码 ──────────────────────────────────────────
cd "$APP_DIR"

# 保存当前 commit 用于回滚
PREV_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "none")
log "当前版本: $PREV_COMMIT"

log "拉取最新代码..."
git fetch origin --prune
git checkout "$TARGET_REF"
if [ "$TARGET_REF" = "main" ]; then
  git pull origin main
fi

NEW_COMMIT=$(git rev-parse HEAD)
log "新版本: $NEW_COMMIT"

if [ "$PREV_COMMIT" = "$NEW_COMMIT" ]; then
  log "代码无变化，跳过构建"
  exit 0
fi

# ── 2. 安装依赖 + 构建 ──────────────────────────────────────
log "安装依赖..."
yarn install --frozen-lockfile 2>&1 | tail -5

log "构建 Next.js..."
yarn build 2>&1 | tail -10

# ── 3. 重启服务 ──────────────────────────────────────────────
log "重启 PM2 进程: $PM2_NAME"
pm2 restart "$PM2_NAME" --update-env

# ── 4. 健康检查 ──────────────────────────────────────────────
log "执行健康检查: $HEALTH_URL"
for i in $(seq 1 $MAX_RETRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    log "健康检查通过 (HTTP $HTTP_CODE) — 第 ${i} 次尝试"
    break
  fi
  if [ "$i" = "$MAX_RETRIES" ]; then
    log "ERROR: 健康检查失败 (HTTP $HTTP_CODE)，开始回滚..."
    # ── 回滚逻辑 ──
    git checkout "$PREV_COMMIT"
    yarn install --frozen-lockfile
    yarn build
    pm2 restart "$PM2_NAME" --update-env
    log "已回滚到: $PREV_COMMIT"
    exit 1
  fi
  sleep $RETRY_INTERVAL
done

# ── 5. 记录结果 ──────────────────────────────────────────────
log "========================================="
log "部署成功"
log "版本: $NEW_COMMIT"
log "操作者: $DEPLOYER"
log "========================================="

pm2 save
