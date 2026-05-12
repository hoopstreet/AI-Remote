#!/bin/sh
cd ~/ish-dev || exit
echo "[SUPABASE] Applying schema..."
### Requires SUPABASE_URL and SUPABASE_SERVICE_KEY
SQL_FILE="supabase/schema.sql"
if [ -f "$SQL_FILE" ]; then
  curl -s "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"sql\": $(printf '%s' "$(cat $SQL_FILE)" | jq -Rs .)}"
  echo "[SUPABASE] Schema applied"
else
  echo "[SUPABASE] No schema file"
fi