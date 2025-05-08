#!/bin/bash

# Script to move content from wp folder to content folder
# This will ensure all content is in the correct location for the links to work

# Root directory
ROOT_DIR="/Users/olly/dev/eps-static"
WP_DIR="$ROOT_DIR/wp"
CONTENT_DIR="$ROOT_DIR/content"

# Check if wp directory exists
if [ ! -d "$WP_DIR" ]; then
  echo "WP directory does not exist!"
  exit 1
fi

# Function to copy a file or directory with its structure
copy_with_structure() {
  local source_path=$1
  local rel_path=${source_path#$WP_DIR/}
  local target_path="$CONTENT_DIR/$rel_path"
  local target_dir=$(dirname "$target_path")

  mkdir -p "$target_dir"

  if [ -d "$source_path" ]; then
    # If it's a directory, create it
    mkdir -p "$target_path"
  else
    # If it's a file, copy it
    cp "$source_path" "$target_path"
    echo "Copied: $source_path -> $target_path"
  fi
}

# Find all files and directories in wp folder
echo "Moving files from wp to content..."
find "$WP_DIR" -type f | while read file; do
  copy_with_structure "$file"
done

echo "Done! Content has been moved from wp to content folder."