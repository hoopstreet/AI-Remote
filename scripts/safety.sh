#!/bin/sh
cd ~/ish-dev || exit
echo "[SAFETY] Checking rules..."
### Block dangerous patterns
grep -R "rm -rf /" -n . && { echo "[BLOCK] Dangerous command"; exit 1; }
### Protect critical files
CRITICAL="docs/DNA.md docs/VERSION.md"
for f in $CRITICAL; do
  [ -f "$f" ] || { echo "[BLOCK] Missing $f"; exit 1; }
done
echo "[SAFETY] Passed"
sh scripts/tests.sh