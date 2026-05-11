#!/bin/sh
cd ~/ish-dev || exit
TASK_FILE="docs/Task.md"
PLAN_FILE="tmp/plan.json"
mkdir -p tmp

TASK=$(tail -n 20 $TASK_FILE)
PROMPT="You are a senior software architect. Convert this task into a STRICT JSON plan with steps and target files: $TASK"
echo "$PROMPT" > tmp/planner_prompt.txt

sh scripts/ai-engine.sh tmp/planner_prompt.txt $PLAN_FILE
echo "[AI PLANNER] Plan generated in $PLAN_FILE"