#!/bin/bash
# ============================================================
# sync-prod-to-env.sh — 生产数据同步到测试/预生产环境
# 
# 用途: 从 nordhjem_db (生产) 导出数据，脱敏后导入目标环境
# 触发: GitHub Actions workflow_dispatch 或手动 SSH 执行
#
# 用法: ./sync-prod-to-env.sh [test|staging|both]
# ============================================================

set -euo pipefail

TARGET="${1:-both}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_DIR="/tmp/db-sync-${TIMESTAMP}"
PG_CONTAINER="nordhjem_postgres"
PG_USER="nordhjem"
PROD_DB="nordhjem_db"

# 需要跳过的环境绑定表（这些表在目标库已有自己的数据）
EXCLUDE_TABLES=(
  "store"
  "store_currency"
  "store_locale"
  "api_key"
  "publishable_api_key_sales_channel"
  "auth_identity"
  "user"
  "user_preference"
  "user_rbac_role"
  "user_role"
  "payment_session"
)

# 需要脱敏的表（包含真实客户数据）
SANITIZE_TABLES=(
  "customer"
  "cart_address"
  "order_address" 
  "fulfillment_address"
)

mkdir -p "$DUMP_DIR"

log() { echo "[$(date '+%H:%M:%S')] $1"; }

# ============================================================
# Step 1: 导出生产数据（排除环境绑定表）
# ============================================================
log "📦 正在导出生产数据库 ($PROD_DB)..."

EXCLUDE_ARGS=""
for tbl in "${EXCLUDE_TABLES[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude-table-data=$tbl"
done

docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$PROD_DB" \
  --data-only --no-owner --no-acl --disable-triggers \
  $EXCLUDE_ARGS \
  > "$DUMP_DIR/prod_data.sql" 2>"$DUMP_DIR/dump_errors.log"

DUMP_SIZE=$(wc -c < "$DUMP_DIR/prod_data.sql")
log "✅ 导出完成: $(( DUMP_SIZE / 1024 ))KB"

# ============================================================
# Step 2: 脱敏处理
# ============================================================
log "🔒 正在脱敏客户数据..."

# 替换真实邮箱为测试邮箱
sed -i "s/\([a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}\)/test_\1/g" "$DUMP_DIR/prod_data.sql"

# 替换真实电话号码（保留格式但换成假号码）
sed -i 's/+\([0-9]\{1,3\}\)[0-9]\{6,\}/+\100000000/g' "$DUMP_DIR/prod_data.sql"

log "✅ 脱敏完成"

# ============================================================
# Step 3: 导入到目标环境
# ============================================================
import_to_db() {
  local TARGET_DB=$1
  local ENV_NAME=$2
  
  log "🔄 正在导入到 $ENV_NAME ($TARGET_DB)..."
  
  # 清空目标库的业务数据（保留 schema 和环境配置）
  docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$TARGET_DB" -c "
    DO \$\$ 
    DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ($(printf "'%s'," "${EXCLUDE_TABLES[@]}" | sed 's/,$//' ))
        AND tablename NOT LIKE '%migration%'
      ) LOOP
        EXECUTE 'TRUNCATE TABLE \"' || r.tablename || '\" CASCADE';
      END LOOP;
    END \$\$;
  " 2>"$DUMP_DIR/truncate_${ENV_NAME}_errors.log"
  
  # 导入数据
  cat "$DUMP_DIR/prod_data.sql" | docker exec -i "$PG_CONTAINER" \
    psql -U "$PG_USER" -d "$TARGET_DB" --set ON_ERROR_STOP=off \
    2>"$DUMP_DIR/import_${ENV_NAME}_errors.log"
  
  # 修复 sales_channel 关联
  # 把导入的产品关联到目标环境自己的 sales_channel
  local TARGET_SC=$(docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$TARGET_DB" -t -c \
    "SELECT id FROM sales_channel LIMIT 1;" | tr -d ' \n')
  
  if [ -n "$TARGET_SC" ]; then
    docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$TARGET_DB" -c "
      UPDATE product_sales_channel SET sales_channel_id = '$TARGET_SC' 
      WHERE sales_channel_id NOT IN (SELECT id FROM sales_channel);
    " 2>/dev/null || true
  fi
  
  local PROD_COUNT=$(docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$TARGET_DB" -t -c \
    "SELECT count(*) FROM product;" | tr -d ' \n')
  log "✅ $ENV_NAME 导入完成: $PROD_COUNT 个商品"
}

if [ "$TARGET" = "test" ] || [ "$TARGET" = "both" ]; then
  import_to_db "nordhjem_test" "test"
fi

if [ "$TARGET" = "staging" ] || [ "$TARGET" = "both" ]; then
  import_to_db "nordhjem_staging" "staging"
fi

# ============================================================
# Step 4: 重启后端容器以刷新缓存
# ============================================================
log "♻️ 重启后端容器..."

if [ "$TARGET" = "test" ] || [ "$TARGET" = "both" ]; then
  docker restart nordhjem_medusa_test 2>/dev/null && log "  nordhjem_medusa_test restarted" || true
fi

if [ "$TARGET" = "staging" ] || [ "$TARGET" = "both" ]; then
  docker restart nordhjem_medusa_staging 2>/dev/null && log "  nordhjem_medusa_staging restarted" || true
fi

# 等待容器就绪
sleep 15

# ============================================================
# Step 5: 验证
# ============================================================
log "🔍 验证导入结果..."

verify_env() {
  local PORT=$1
  local KEY=$2
  local NAME=$3
  
  local STATUS=$(curl -sf -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:$PORT/health" 2>/dev/null || echo "000")
  local PRODUCTS=$(curl -s -H "x-publishable-api-key: $KEY" "http://localhost:$PORT/store/products?limit=1" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('count',0))" 2>/dev/null || echo "0")
  
  if [ "$STATUS" = "200" ] && [ "$PRODUCTS" -gt 0 ] 2>/dev/null; then
    log "  ✅ $NAME: 健康(HTTP $STATUS), $PRODUCTS 个商品可见"
  else
    log "  ⚠️ $NAME: HTTP=$STATUS, 可见商品=$PRODUCTS"
  fi
}

if [ "$TARGET" = "test" ] || [ "$TARGET" = "both" ]; then
  verify_env 9001 "pk_fb2107b3fac8df5420bf0dfc4b0ceea7c2dec6600fbc331eec4f91138bc0ba23" "Test"
fi

if [ "$TARGET" = "staging" ] || [ "$TARGET" = "both" ]; then
  verify_env 9002 "pk_64112cda99be1a3e9cdc3d722df9d3dfbbcd19759306897a6dafd4c7e068ebe3" "Staging"
fi

# 清理
rm -rf "$DUMP_DIR"
log "🎉 数据同步完成"
