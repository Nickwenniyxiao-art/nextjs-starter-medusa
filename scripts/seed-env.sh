#!/bin/bash
# ============================================================
# seed-env.sh — 为测试/预生产环境创建 admin + 标准测试商品
#
# 用途: CD 部署后自动执行，确保环境可用
# 用法: ./seed-env.sh <test|staging> <api_port> <publishable_key>
# ============================================================

set -euo pipefail

ENV_NAME="${1:?用法: seed-env.sh <test|staging> <api_port> <publishable_key>}"
API_PORT="${2:?缺少 API 端口}"
PUB_KEY="${3:?缺少 Publishable API Key}"
API_BASE="http://localhost:${API_PORT}"
ADMIN_EMAIL="admin@nordhjem.com"
ADMIN_PASS="NordHjem2026!"

log() { echo "[seed-${ENV_NAME}] $1"; }

# ============================================================
# Step 1: 确保 admin 用户存在
# ============================================================
log "👤 检查 admin 用户..."

# 尝试登录
TOKEN=$(curl -sf -X POST "${API_BASE}/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}" \
  2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  log "  Admin 不存在，正在创建..."
  
  # 根据环境选择对应的 Docker 容器
  case "$ENV_NAME" in
    test)    CONTAINER="nordhjem_medusa_test" ;;
    staging) CONTAINER="nordhjem_medusa_staging" ;;
    *)       log "❌ 未知环境: $ENV_NAME"; exit 1 ;;
  esac
  
  docker exec "$CONTAINER" npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASS" 2>&1 | tail -1
  sleep 3
  
  # 重新获取 token
  TOKEN=$(curl -sf -X POST "${API_BASE}/auth/user/emailpass" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}" \
    2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || echo "")
fi

if [ -z "$TOKEN" ]; then
  log "❌ 无法获取 admin token，跳过商品创建"
  exit 1
fi

log "  ✅ Admin 登录成功"

# ============================================================
# Step 2: 检查是否已有商品
# ============================================================
PRODUCT_COUNT=$(curl -sf -H "x-publishable-api-key: ${PUB_KEY}" \
  "${API_BASE}/store/products?limit=1" 2>/dev/null | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('count',0))" 2>/dev/null || echo "0")

if [ "$PRODUCT_COUNT" -gt 0 ] 2>/dev/null; then
  log "✅ 已有 ${PRODUCT_COUNT} 个商品，跳过 seed"
  exit 0
fi

log "📦 没有商品，开始创建标准测试数据..."

# ============================================================
# Step 3: 获取 Sales Channel
# ============================================================
SC_ID=$(curl -sf -H "Authorization: Bearer $TOKEN" \
  "${API_BASE}/admin/sales-channels" | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d['sales_channels'][0]['id'])" 2>/dev/null)

if [ -z "$SC_ID" ]; then
  log "❌ 无法获取 sales channel"
  exit 1
fi

log "  Sales Channel: $SC_ID"

# ============================================================
# Step 4: 创建标准测试商品
# ============================================================
create_product() {
  local TITLE="$1"
  local PRICE="$2"
  local CURRENCY="${3:-dkk}"
  
  RESULT=$(curl -sf -X POST "${API_BASE}/admin/products" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"$TITLE\",
      \"description\": \"标准测试商品 — 由 seed 脚本自动创建\",
      \"status\": \"published\",
      \"sales_channels\": [{\"id\": \"$SC_ID\"}],
      \"options\": [{\"title\": \"Color\", \"values\": [\"Natural\"]}],
      \"variants\": [{
        \"title\": \"Default\",
        \"options\": {\"Color\": \"Natural\"},
        \"manage_inventory\": false,
        \"prices\": [{\"amount\": $PRICE, \"currency_code\": \"$CURRENCY\"}]
      }]
    }" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('product',{}).get('id','FAILED'))" 2>/dev/null)
  
  if [ "$RESULT" != "FAILED" ] && [ -n "$RESULT" ]; then
    log "  ✅ $TITLE → $RESULT"
  else
    log "  ⚠️ $TITLE 创建失败"
  fi
}

create_product "NordHjem Birch Sofa"       129900
create_product "NordHjem Wool Throw"        29900
create_product "NordHjem Ceramic Vase"      19900
create_product "NordHjem Linen Cushion"      9900
create_product "NordHjem Oak Side Table"    59900

# ============================================================
# Step 5: 验证
# ============================================================
sleep 2
FINAL_COUNT=$(curl -sf -H "x-publishable-api-key: ${PUB_KEY}" \
  "${API_BASE}/store/products?limit=1" 2>/dev/null | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('count',0))" 2>/dev/null || echo "0")

log "🎉 Seed 完成: ${FINAL_COUNT} 个商品可通过 Store API 访问"
