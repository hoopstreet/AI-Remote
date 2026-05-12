#!/bin/sh
cd ~/ai-remote

# Ensure the remote is set to SSH
git remote set-url origin git@github.com:hoopstreet/ai-remote.git

echo "📦 Committing project updates (Ignoring .env)..."
git add .
# This will specifically avoid adding .env if .gitignore is working
git commit -m "iSH Build Sync: $(date)"

echo "🚀 Pushing to GitHub via Secure SSH Key..."
git push -f origin main
