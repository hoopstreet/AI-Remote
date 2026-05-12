#!/bin/bash
echo "--- GENERATING SOURCE MAP ---"
echo "# Project Source Map" > docs/SOURCE_MAP.md
echo "Generated on: $(date)" >> docs/SOURCE_MAP.md
echo "## Directory Structure" >> docs/SOURCE_MAP.md
echo '```' >> docs/SOURCE_MAP.md
find . -maxdepth 3 -not -path '*/.*' -not -path './node_modules*' >> docs/SOURCE_MAP.md
echo '```' >> docs/SOURCE_MAP.md
echo "Source map updated successfully."
