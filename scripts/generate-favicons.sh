#!/usr/bin/env bash
# TVORTEKA — favicon generator from assets/tvortekLogonoBg.png
# Requires: ImageMagick (brew install imagemagick)
# Usage: ./scripts/generate-favicons.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/tvortekLogonoBg.png"
TOKENS="$ROOT/css/tokens.css"
TMPDIR="${TMPDIR:-/tmp}/tvorteka-favicon-$$"

if ! command -v magick >/dev/null 2>&1; then
  echo "ERROR: magick not found. Install with: brew install imagemagick" >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "ERROR: source not found: $SRC" >&2
  exit 1
fi

parse_token() {
  local name=$1 fallback=$2
  local value
  value=$(grep -E "^\s*${name}:" "$TOKENS" | head -1 | sed -E 's/.*(#[0-9A-Fa-f]{6}).*/\1/')
  if [[ ! "$value" =~ ^#[0-9A-Fa-f]{6}$ ]]; then
    value="$fallback"
  fi
  echo "$value"
}

THEME_COLOR=$(parse_token "--color-ink" "#0E0E0C")
BG_COLOR=$(parse_token "--color-paper" "#F7F6F2")

mkdir -p "$TMPDIR"
trap 'rm -rf "$TMPDIR"' EXIT

SQUARE="$TMPDIR/square.png"

echo "TVORTEKA favicon generator"
echo "  source:  assets/tvortekLogonoBg.png"
echo "  theme:   $THEME_COLOR (--color-ink)"
echo "  bg:      $BG_COLOR (--color-paper)"
echo ""

# Square logo — upscale for crisp downscales
magick "$SRC" -resize 1024x1024 "$SQUARE"

echo "Generating PNG icons…"
magick "$SQUARE" -resize 512x512 "$ROOT/android-chrome-512x512.png"
magick "$SQUARE" -resize 192x192 "$ROOT/android-chrome-192x192.png"
magick "$SQUARE" -resize 180x180 "$ROOT/apple-touch-icon.png"
magick "$SQUARE" -resize 32x32   "$ROOT/favicon-32x32.png"
magick "$SQUARE" -resize 16x16   "$ROOT/favicon-16x16.png"

echo "Generating favicon.ico (16, 32, 48)…"
magick "$SQUARE" -define icon:auto-resize=16,32,48 "$ROOT/favicon.ico"

cat > "$ROOT/site.webmanifest" <<EOF
{
  "name": "Tvorteka",
  "short_name": "Tvorteka",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "$THEME_COLOR",
  "background_color": "$BG_COLOR",
  "display": "standalone"
}
EOF

echo ""
echo "Created:"
for f in favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png \
         android-chrome-192x192.png android-chrome-512x512.png site.webmanifest; do
  ls -lh "$ROOT/$f" | awk '{print "  " $9 " (" $5 ")"}'
done

echo ""
echo "Next: add <link rel=\"icon\" …> tags to HTML <head> (if not already)."
