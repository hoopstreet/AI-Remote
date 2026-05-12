#!/bin/sh
cd ~/ai-remote

# Sanitize token
GH_TOKEN=$(grep '^GH_TOKEN=' .env | cut -d'=' -f2 | tr -d '"' | tr -d '\r' | tr -d ' ')
USER="hoopstreet"
REPO="github.com/hoopstreet/ai-remote.git"

if [ -z "$GH_TOKEN" ]; then
    echo "❌ Error: Token not found."
    exit 1
fi

echo "📦 Committing..."
git add .
git commit -m "iSH Fix Auth: $(date)"

echo "🚀 Pushing with New Token..."
git push -f "https://${USER}:${GH_TOKEN}@${REPO}" main
