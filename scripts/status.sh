#!/bin/bash
echo "--- SYSTEM STATUS ---"
cat docs/VERSION.md
echo "--- RECENT TASKS ---"
tail -n 5 docs/Task.md
echo "--- SOURCE MAP ---"
cat docs/SOURCE_MAP.md
