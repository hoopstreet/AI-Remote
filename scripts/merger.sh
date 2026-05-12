#!/bin/sh
cd ~/ish-dev || exit
DNA="docs/DNA.md"
TASK="docs/Task.md"
echo "[MERGER] Consolidating into DNA..."
DATE=$(date +"%Y-%m-%d %H:%M:%S")
echo "\n## Update $DATE" >> "$DNA"
### Extract latest task title + objective
TITLE=$(grep "^## T-" -n "$TASK" | tail -n1 | cut -d: -f2-)
OBJ=$(grep -A2 "$TITLE" "$TASK" | grep "Objective" | cut -d: -f2-)
echo "- Task: $TITLE" >> "$DNA"
echo "- Objective: $OBJ" >> "$DNA"
if [ -f src/output.js ]; then
  echo "- Files: src/output.js" >> "$DNA"
fi
echo "[MERGER] DNA updated"
sh scripts/source-map.sh