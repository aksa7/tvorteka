#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Logo: → 280px (2x retina dydis)"
magick assets/tvortekaLogo.png -resize 280x -strip assets/tvortekaLogo.png

echo "→ Hero mobile: → 828px"
magick assets/tvortekaHeroMobile.webp -resize 828x -quality 82 -strip assets/tvortekaHeroMobile.webp

echo "→ Partner logos: → 240px"
for f in assets/partnerlogos/*.webp; do
  magick "$f" -resize 240x -quality 82 -strip "$f"
done

echo "→ premium_picture: → 800px"
magick assets/premium_picture.webp -resize 800x -quality 82 -strip assets/premium_picture.webp

echo "✓ Optimizuota. Toliau: npm run build → testas → commit → push."