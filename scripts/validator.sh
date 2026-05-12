#!/bin/bash
echo "--- SAFETY VALIDATION ---"
# Check if Task.md exists
if [ ! -f docs/Task.md ]; then
  echo "Error: Task.md missing. Stopping."
  exit 1
fi
# Prevent overwriting DNA.md directly
if grep -q "DNA.md" docs/Task.md; then
  echo "Security Alert: Task attempted to modify DNA.md directly. Aborting."
  exit 1
fi
echo "Validation Passed."
