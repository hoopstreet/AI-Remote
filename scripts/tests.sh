#!/bin/sh
cd ~/ish-dev || exit
echo "[TEST] Running basic checks..."
[ -f src/output.js ] || { echo "[TEST] Missing output"; exit 1; }
grep -q "console.log" src/output.js || echo "[TEST] Warning: no log found"
echo "[TEST] Passed"
sh scripts/merger.sh