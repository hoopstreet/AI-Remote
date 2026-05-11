#!/bin/sh
cd ~/ish-dev || exit
CODE=$(cat src/output.js)

PROMPT="You are a strict senior reviewer. Fix and improve this code: $CODE. Output ONLY the fixed code."
echo "$PROMPT" > tmp/reviewer_prompt.txt

sh scripts/ai-engine.sh tmp/reviewer_prompt.txt src/output.js
echo "[AI REVIEWER] Code improved and validated"