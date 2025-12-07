#!/bin/bash

OUTPUT="files.md"

echo "# Repository File List" > "$OUTPUT"
echo "" >> "$OUTPUT"

# Use find to list all files/folders except .DS_Store
find . -not -name ".DS_Store" \
    | sed 's|^\./||' \
    | sort >> "$OUTPUT"

echo "Generated $OUTPUT"