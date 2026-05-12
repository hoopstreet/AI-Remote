#!/bin/sh
# This script bridges Telegram tasks to the GitHub Actions trigger (Task.md)

TASK_FILE="../docs/Task.md"
mkdir -p ../docs

# Capture the input from the Telegram bot
TASK_INPUT="$1"

echo "📝 Logged Task: $TASK_INPUT"

# Append the task to the Task.md file for GitHub Actions to read
echo "- [ ] TASK: $TASK_INPUT (Generated via Telegram: $(date))" >> "$TASK_FILE"

# Output for the Telegram bot to send back to you
echo "Successfully added to Task.md. GitHub Actions will process this after /confirm."
