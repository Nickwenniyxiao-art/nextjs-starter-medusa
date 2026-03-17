#!/bin/bash
# Frontend Production Smoke Test
# Verifies core pages are accessible after deployment

set -euo pipefail

BASE_URL="${1:-http://localhost:8000}"
FAILED=0
TOTAL=0

check_page() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  TOTAL=$((TOTAL + 1))

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$url" 2>/dev/null || echo "000")

  if [ "$HTTP_STATUS" = "$expected_status" ]; then
    echo "✅ $name — HTTP $HTTP_STATUS"
  else
    echo "❌ $name — Expected $expected_status, got $HTTP_STATUS"
    FAILED=$((FAILED + 1))
  fi
}

echo "🔍 Running frontend smoke tests against: $BASE_URL"
echo "============================================"

# Core pages
check_page "Homepage" "$BASE_URL/" "200"
check_page "Store Page" "$BASE_URL/store" "200"

# Static assets
check_page "Favicon" "$BASE_URL/favicon.ico" "200"

echo "============================================"
echo "Results: $((TOTAL - FAILED))/$TOTAL passed"

if [ "$FAILED" -gt 0 ]; then
  echo "❌ $FAILED smoke test(s) failed!"
  exit 1
fi

echo "✅ All frontend smoke tests passed!"
