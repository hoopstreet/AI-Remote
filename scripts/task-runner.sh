#!/bin/sh
echo "--- [PHASE 1: INTAKE] ---"
TASK_FILE="docs/Task.md"
if grep -q "Status: pending" "$TASK_FILE"; then
  ACTIVE_TASK=$(grep -B 2 "Status: pending" "$TASK_FILE" | head -n 1)
  echo "Executing: $ACTIVE_TASK"
  # Trigger the AI Agent
  node src/agents/executor.js "$ACTIVE_TASK"
else
  echo "No pending tasks found."
fi
