#!/bin/sh
echo "--- [ SYSTEM STATUS ] ---"
[ -f docs/VERSION.md ] && cat docs/VERSION.md || echo "Version file missing"
echo "--- [ LATEST TASK ] ---"
[ -f docs/Task.md ] && tail -n 10 docs/Task.md || echo "No active tasks"
