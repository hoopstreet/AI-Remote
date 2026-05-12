#!/bin/sh
cd ~/ai-remote || exit

echo "[SYSTEM v5] Initializing Environment..."
mkdir -p feedback tmp src docs/logs revenue/gateways

echo "[SYSTEM v5] Starting Intelligence Loop..."
# Context awareness
sh agents/context/context.sh

# AI Execution
node scripts/ai-executor.js "$(grep -B 2 "Status: pending" docs/Task.md | head -n 1)"

# Self-Learning & Scoring
sh scoring/scorer.sh
sh feedback/feedback.sh

# Distribution
sh scripts/saas-generator.sh
sh scripts/supabase-sync.sh

echo "[SYSTEM v5] Cycle Complete."
