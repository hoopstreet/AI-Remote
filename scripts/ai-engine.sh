#!/bin/sh
cd ~/ish-dev || exit
PROMPT_FILE="$1"
OUT_FILE="$2"
PROVIDER="${AI_PROVIDER:-mock}"
echo "[AI-ENGINE] Provider: $PROVIDER"

if [ "$PROVIDER" = "openai" ]; then
  # Requires: OPENAI_API_KEY
  RESPONSE=$(curl -s https://api.openai.com/v1/responses \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{ \"model\": \"gpt-4.1-mini\", \"input\": $(printf '%s' "$(cat $PROMPT_FILE)" | jq -Rs .) }" | jq -r '.output.content.text')
  echo "$RESPONSE" > "$OUT_FILE"
elif [ "$PROVIDER" = "hf" ]; then
  # Requires: HF_API_TOKEN, HF_MODEL
  RESPONSE=$(curl -s https://api-inference.huggingface.co/models/$HF_MODEL \
    -H "Authorization: Bearer $HF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"inputs\": $(printf '%s' "$(cat $PROMPT_FILE)" | jq -Rs .)}")
  echo "$RESPONSE" | jq -r '..generated_text // .' > "$OUT_FILE"
else
  echo "// mock output" > "$OUT_FILE"
  echo "console.log('mock AI');" >> "$OUT_FILE"
fi
echo "[AI-ENGINE] Output -> $OUT_FILE"