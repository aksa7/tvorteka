#!/usr/bin/env bash
# TVORTEKA — WebP image optimizer
# Requires: cwebp (brew install webp)
# Usage: ./scripts/optimize-images.sh
# Idempotent: skips files already <= 200KB; preserves originals in assets/_originals/

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT/assets/_originals"
QUALITY=78
MAX_WIDTH=1600
SKIP_MAX_BYTES=$((200 * 1024))   # 200 KB — already optimized
PROCESS_MIN_BYTES=$((300 * 1024)) # 300 KB — threshold for non-insideproducts

if ! command -v cwebp >/dev/null 2>&1; then
  echo "ERROR: cwebp not found. Install with: brew install webp" >&2
  exit 1
fi

human_size() {
  local bytes=$1
  if (( bytes >= 1048576 )); then
    echo "$(( bytes / 1048576 ))M"
  elif (( bytes >= 1024 )); then
    echo "$(( bytes / 1024 ))K"
  else
    echo "${bytes}B"
  fi
}

should_process() {
  local file=$1
  local rel="${file#$ROOT/}"
  local backup="$BACKUP_DIR/$rel"
  local size
  size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")

  # Already optimized in a previous run
  if [[ -f "$backup" ]]; then
    return 1
  fi

  # Never re-process already small files
  if (( size <= SKIP_MAX_BYTES )); then
    return 1
  fi

  # Always process insideproducts over 200KB
  if [[ "$file" == *"/insideproducts/"* ]]; then
    return 0
  fi

  # Other assets: only if over 300KB
  if (( size > PROCESS_MIN_BYTES )); then
    return 0
  fi

  return 1
}

backup_original() {
  local file=$1
  local rel="${file#$ROOT/}"
  local dest="$BACKUP_DIR/$rel"

  if [[ -f "$dest" ]]; then
    return 0
  fi

  mkdir -p "$(dirname "$dest")"
  cp -p "$file" "$dest"
  echo "  backup → assets/_originals/$rel"
}

optimize_file() {
  local file=$1
  local before after tmp

  before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
  tmp="${file}.opt.tmp.webp"

  cwebp -quiet -q "$QUALITY" -resize "$MAX_WIDTH" 0 "$file" -o "$tmp"

  after=$(stat -f%z "$tmp" 2>/dev/null || stat -c%s "$tmp")

  # Keep original if optimization didn't help meaningfully
  if (( after >= before )); then
    rm -f "$tmp"
    echo "  skip (no gain): $(human_size "$before") — $file"
    return 0
  fi

  mv "$tmp" "$file"
  echo "  $(human_size "$before") → $(human_size "$after")  $file"
}

mkdir -p "$BACKUP_DIR"

echo "TVORTEKA image optimizer"
echo "  quality=$QUALITY  max_width=${MAX_WIDTH}px  skip<=${SKIP_MAX_BYTES}B"
echo "  backup dir: assets/_originals/"
echo ""

processed=0
skipped=0

while IFS= read -r -d '' file; do
  rel="${file#$ROOT/}"

  if ! should_process "$file"; then
    ((skipped++)) || true
    continue
  fi

  echo "[$rel]"
  backup_original "$file"
  optimize_file "$file"
  ((processed++)) || true
  echo ""
done < <(find "$ROOT/assets" -name "*.webp" \
  ! -path "$BACKUP_DIR/*" \
  -print0 | sort -z)

echo "Done. Processed: $processed  Skipped (already small): $skipped"
echo "Review visually, then commit optimized assets."
