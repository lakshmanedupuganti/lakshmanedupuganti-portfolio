#!/bin/bash
set -e

CLI_DIR="$(dirname "$0")"
PATCH_DIR="$CLI_DIR/patches"
NEXT_DIR="./node_modules/next/dist"

echo "Applying Next.js patches..."

# request-store.js
cp "$PATCH_DIR/request-store.js" \
   "$NEXT_DIR/server/async-storage/request-store.js"

# app-page.runtime.prod.js
cp "$PATCH_DIR/app-page.runtime.prod.js" \
   "$NEXT_DIR/compiled/next-server/app-page.runtime.prod.js"

# app-page.runtime.dev.js
cp "$PATCH_DIR/app-page.runtime.dev.js" \
   "$NEXT_DIR/compiled/next-server/app-page.runtime.dev.js"

echo "Next.js patches applied successfully!"