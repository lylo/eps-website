#!/bin/bash

# Script to fix links in the EPS static site
# This script will:
# 1. Update links in content files to remove /wp/ prefix and -v2 suffix
# 2. Ensure content is in the right location for homepage links

# Root directory
ROOT_DIR="/Users/olly/dev/eps-static"
CONTENT_DIR="$ROOT_DIR/content"

# Create necessary directories without -v2 if they don't exist
echo "Creating directories..."
mkdir -p "$CONTENT_DIR/about"
mkdir -p "$CONTENT_DIR/whats-on"
mkdir -p "$CONTENT_DIR/newsletters"
mkdir -p "$CONTENT_DIR/exhibitions"
mkdir -p "$CONTENT_DIR/membership"
mkdir -p "$CONTENT_DIR/learning"
mkdir -p "$CONTENT_DIR/groups"
mkdir -p "$CONTENT_DIR/facilities"
mkdir -p "$CONTENT_DIR/contact"

# Copy content from -v2 folders to their non-suffixed counterparts
echo "Copying content from -v2 folders..."
[ -d "$CONTENT_DIR/about-eps-v2" ] && cp -r "$CONTENT_DIR/about-eps-v2"/* "$CONTENT_DIR/about/"
[ -d "$CONTENT_DIR/whats-on-v2" ] && cp -r "$CONTENT_DIR/whats-on-v2"/* "$CONTENT_DIR/whats-on/"
[ -d "$CONTENT_DIR/newsletters-v2" ] && cp -r "$CONTENT_DIR/newsletters-v2"/* "$CONTENT_DIR/newsletters/"
[ -d "$CONTENT_DIR/exhibitions-v2" ] && cp -r "$CONTENT_DIR/exhibitions-v2"/* "$CONTENT_DIR/exhibitions/"
[ -d "$CONTENT_DIR/membership-v2" ] && cp -r "$CONTENT_DIR/membership-v2"/* "$CONTENT_DIR/membership/"
[ -d "$CONTENT_DIR/learning-v2" ] && cp -r "$CONTENT_DIR/learning-v2"/* "$CONTENT_DIR/learning/"
[ -d "$CONTENT_DIR/groups-v2" ] && cp -r "$CONTENT_DIR/groups-v2"/* "$CONTENT_DIR/groups/"
[ -d "$CONTENT_DIR/facilities-v2" ] && cp -r "$CONTENT_DIR/facilities-v2"/* "$CONTENT_DIR/facilities/"
[ -d "$CONTENT_DIR/contact" ] || ([ -d "$CONTENT_DIR/contact-v2" ] && cp -r "$CONTENT_DIR/contact-v2"/* "$CONTENT_DIR/contact/")

# Fix links in all markdown files
echo "Fixing links in all markdown files..."
find "$CONTENT_DIR" -name "*.md" | while read file; do
  echo "Fixing links in $file..."

  # Replace links with /wp/ prefix and -v2 suffix
  sed -i '' -e 's|https://www.edinburghphotographicsociety.co.uk/wp/|/|g' \
           -e 's|/wp/|/|g' \
           -e 's|/\([^/]*\)-v2/|/\1/|g' \
           -e 's|/\([^/]*\)-v2$|/\1|g' \
           -e 's|/\([^/]*\)-v2#|/\1#|g' \
           "$file"
done

echo "Done! Links have been fixed."