#!/bin/sh
cd ~/ai-remote

# Extract and clean tokens
RAW_TOKEN=$(grep GH_TOKEN .env | cut -d'=' -f2 | tr -d '"' | tr -d '\r' | tr -d ' ')
USER="hoopstreet"
REPO="github.com/hoopstreet/ai-remote.git"

if [ -z "$RAW_TOKEN" ]; then
    echo "❌ Error: GH_TOKEN is empty."
    exit 1
fi

echo "📦 Committing build..."
git add .
git commit -m "iSH Build Sync: $(date)"

echo "🚀 Pushing to GitHub via Token..."
# Headless authentication
git push -f "https://${USER}:${RAW_TOKEN}@${REPO}" main
