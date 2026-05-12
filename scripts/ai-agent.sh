#!/bin/sh
cd ~/ish-dev || exit
TASK="$1"
mkdir -p tmp src
PROMPT="tmp/prompt.txt"
OUT="src/output.js"
echo "[AI AGENT] Building prompt..."
cat <<EOT > "$PROMPT"
You are a senior engineer. Task: $TASK
Constraints:
* Do not break existing structure
* Output valid JavaScript file content only
EOT
sh scripts/ai-engine.sh "$PROMPT" "$OUT"
echo "[AI AGENT] Generated code"
sh scripts/fixer.sh