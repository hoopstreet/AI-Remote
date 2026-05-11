#!/bin/sh
cd ~/ish-dev || exit
MAP="docs/SOURCE_MAP.md"
echo "[SOURCE MAP] Updating..."
DATE=$(date +"%Y-%m-%d")
echo "\n## $DATE" >> "$MAP"
if [ -f src/output.js ]; then
  echo "- src/output.js : generated/modified" >> "$MAP"
fi
echo "[SOURCE MAP] Done"
sh scripts/version.sh