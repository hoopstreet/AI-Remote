#!/bin/sh
cd ~/ai-remote

# 1. Clean the token (Remove quotes, carriage returns, and spaces)
RAW_TOKEN=$(grep GH_TOKEN .env | cut -d'=' -f2)
GH_TOKEN=$(echo $RAW_TOKEN | tr -d '"' | tr -d '\r' | tr -d ' ')
USER="hoopstreet"
REPO="github.com/hoopstreet/ai-remote.git"

if [ -z "$GH_TOKEN" ]; then
    echo "❌ Error: GH_TOKEN not found in .env"
    exit 1
fi

echo "📦 Syncing changes..."
git add .
git commit -m "iSH Update: $(date)"

echo "🚀 Pushing to GitHub..."
# Using the token directly in the URL for headless auth
git push -f "https://${USER}:${GH_TOKEN}@${REPO}" main
