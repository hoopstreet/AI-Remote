#!/bin/sh
VERSION_FILE="docs/VERSION.md"
CURRENT=$(grep "VERSION:" $VERSION_FILE | awk '{print $2}')
IFS='.' read -r major minor patch <<< "$CURRENT"
patch=$((patch + 1))
NEW_VERSION="$major.$minor.$patch"
echo "VERSION: $NEW_VERSION" > $VERSION_FILE
echo "STATUS: stable" >> $VERSION_FILE
echo "LAST_UPDATED: $(date +%Y-%m-%d)" >> $VERSION_FILE
echo "v$NEW_VERSION"
