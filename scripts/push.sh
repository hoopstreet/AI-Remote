#!/bin/sh
cd ~/ai-remote

USER="hoopstreet"
REPO="ai-remote"

# Change the remote to SSH if it isn't already
git remote set-url origin git@github.com:${USER}/${REPO}.git

echo "📦 Committing..."
git add .
git commit -m "iSH SSH Push: $(date)"

echo "🚀 Pushing to GitHub via Deploy Key..."
# Use -f to ensure the Task.md updates always go through
git push -f origin main
