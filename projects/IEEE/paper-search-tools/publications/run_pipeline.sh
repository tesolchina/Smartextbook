#!/usr/bin/env bash
# Full publications pipeline
# Usage: SHEETS_TOKEN=<token> bash scripts/publications/run_pipeline.sh

set -e
BASE="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo " HKBU Publications Pipeline"
echo "=========================================="

echo ""
echo "Step 1/3  Parse raw source data …"
python3 "$BASE/1_parse_raw.py"

echo ""
echo "Step 2/3  Resolve metadata (CrossRef / OpenAlex) …"
python3 "$BASE/2_resolve_metadata.py"

echo ""
echo "Step 3/3  Write to new Google Sheet …"
SHEETS_TOKEN="$SHEETS_TOKEN" python3 "$BASE/3_write_sheet.py"

echo ""
echo "Pipeline complete."
