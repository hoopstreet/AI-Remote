#!/bin/sh
echo "--- [PHASE 3: VALIDATION] ---"
# Check for basic project integrity
if [ ! -f docs/VERSION.md ] || [ ! -f docs/DNA.md ]; then
  echo "CRITICAL ERROR: System DNA or Versioning files missing."
  exit 1
fi
# Prevent empty task execution
if ! grep -q "Status:" docs/Task.md; then
  echo "VALIDATION FAILED: Task.md has no valid status schema."
  exit 1
fi
echo "Validation Successful: Project structure is sound."
