#!/bin/sh
cd ~/ish-dev || exit
PLAN=$(cat tmp/plan.json)
mkdir -p src

PROMPT="You are a senior developer. Generate valid JavaScript code based on this plan: $PLAN. Output ONLY code."
echo "$PROMPT" > tmp/coder_prompt.txt

sh scripts/ai-engine.sh tmp/coder_prompt.txt src/output.js
echo "[AI CODER] Code generated in src/output.js"