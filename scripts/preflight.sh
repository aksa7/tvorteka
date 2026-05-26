#!/usr/bin/env bash
# TVORTEKA — pre-deploy preflight checks
# Usage: ./scripts/preflight.sh
# Exit 0 = all fatal checks passed (warnings allowed)

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PREFLIGHT_PORT:-5500}"
BASE="http://127.0.0.1:${PORT}"
FORMSPREE_CANONICAL="https://formspree.io/f/xzdowagr"
WEBP_WARN_BYTES=$((300 * 1024))

FAILS=0
WARNS=0
CHECKS=0

# ── colours (disabled when not a tty) ──
if [[ -t 1 ]]; then
  C_GREEN='\033[0;32m'
  C_RED='\033[0;31m'
  C_YELLOW='\033[0;33m'
  C_CYAN='\033[0;36m'
  C_BOLD='\033[1m'
  C_RESET='\033[0m'
else
  C_GREEN='' C_RED='' C_YELLOW='' C_CYAN='' C_BOLD='' C_RESET=''
fi

pass() { echo -e "  ${C_GREEN}✓ PASS${C_RESET}  $1"; }
fail() { echo -e "  ${C_RED}✗ FAIL${C_RESET}  $1"; FAILS=$((FAILS + 1)); }
warn() { echo -e "  ${C_YELLOW}! WARN${C_RESET}  $1"; WARNS=$((WARNS + 1)); }
section() { echo -e "\n${C_BOLD}${C_CYAN}[$((++CHECKS))] $1${C_RESET}"; }

resolve_ref() {
  local html_file=$1 ref=$2 out
  ref="${ref%%#*}"
  ref="${ref%%\?*}"

  if [[ -z "$ref" || "$ref" =~ ^(https?:|//|data:|mailto:|tel:|javascript:) ]]; then
    return 0
  fi

  local html_dir
  html_dir="$(dirname "$html_file")"

  if [[ "$ref" == /* ]]; then
    out="$ROOT$ref"
  elif [[ "$ref" == */* ]]; then
    out="$(cd "$html_dir" && cd "$(dirname "$ref")" && pwd)/$(basename "$ref")"
  else
    out="$html_dir/$ref"
  fi

  printf '%s' "$out"
}

collect_html_files() {
  find "$ROOT" -name '*.html' \
    ! -path "$ROOT/node_modules/*" \
    ! -path "$ROOT/dist/*" \
    -print | sort
}

# ── [1] Git status ──
check_git_clean() {
  section "Git status (assets/, *.html, css/*.css)"

  if ! command -v git >/dev/null 2>&1 || [[ ! -d "$ROOT/.git" ]]; then
    warn "Not a git repo — skipped"
    return
  fi

  local dirty
  dirty=$(git status --porcelain -- assets/ css/ '*.html' 2>/dev/null || true)

  if [[ -z "$dirty" ]]; then
    pass "Working tree clean for assets/, css/, *.html"
  else
    fail "Uncommitted changes in assets/, css/, or *.html:"
    while IFS= read -r line; do
      echo "         $line"
    done <<< "$dirty"
  fi
}

# ── [2] img src files exist ──
check_img_src() {
  section "Image files (<img src>)"

  local html missing=0 total=0

  while IFS= read -r html; do
    [[ -z "$html" ]] && continue
    local html_dir rel_html
    html_dir="$(dirname "$html")"
    rel_html="${html#$ROOT/}"

    while IFS= read -r src; do
      [[ -z "$src" ]] && continue
      ((total++)) || true
      local resolved
      resolved="$(resolve_ref "$html" "$src")" || true
      if [[ -n "$resolved" && ! -f "$resolved" ]]; then
        fail "Missing: $resolved  (from $rel_html → src=\"$src\")"
        missing=$((missing + 1))
      fi
    done < <(grep -oiE '<img[^>]+src="[^"]+"' "$html" 2>/dev/null \
      | sed -E 's/.*src="([^"]+)".*/\1/' \
      | grep -vE '^(https?:|//|data:)' || true)
  done < <(collect_html_files)

  if (( missing == 0 )); then
    pass "$total local image reference(s) resolve to existing files"
  fi
}

# ── [3] CSS + JS href/src exist ──
check_assets_refs() {
  section "Stylesheets & scripts (link href / script src)"

  local missing=0 total=0

  while IFS= read -r html; do
    [[ -z "$html" ]] && continue
    local rel_html="${html#$ROOT/}"

    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      ((total++)) || true
      local resolved
      resolved="$(resolve_ref "$html" "$ref")"
      if [[ -n "$resolved" && ! -f "$resolved" ]]; then
        fail "Missing: $resolved  (from $rel_html)"
        missing=$((missing + 1))
      fi
    done < <(
      grep -oiE '<link[^>]+rel="stylesheet"[^>]+href="[^"]+"' "$html" 2>/dev/null | sed -E 's/.*href="([^"]+)".*/\1/' || true
      grep -oiE '<link[^>]+href="[^"]+"[^>]+rel="stylesheet"' "$html" 2>/dev/null | sed -E 's/.*href="([^"]+)".*/\1/' || true
      grep -oiE '<script[^>]+src="[^"]+"' "$html" 2>/dev/null | sed -E 's/.*src="([^"]+)".*/\1/' || true
    )
  done < <(collect_html_files)

  if (( missing == 0 )); then
    pass "$total local CSS/JS reference(s) resolve to existing files"
  fi
}

# ── [4] Internal <a href="/..."> → index.html ──
resolve_internal_page() {
  local href=$1 path candidate

  href="${href%%#*}"
  href="${href%%\?*}"

  [[ -z "$href" || "$href" == "#" ]] && return 0
  [[ "$href" =~ ^(mailto:|tel:|javascript:|https?:) ]] && return 0
  [[ "$href" != /* ]] && return 0

  path="${href#/}"
  if [[ -z "$path" ]]; then
    candidate="$ROOT/index.html"
  elif [[ "$path" == */ ]]; then
    candidate="$ROOT/${path}index.html"
  elif [[ "$path" == *.* ]]; then
    candidate="$ROOT/$path"
  else
    candidate="$ROOT/${path}/index.html"
  fi

  if [[ -f "$candidate" ]]; then
    return 0
  fi
  # Direct file (e.g. /assets/foo.webp) — not a directory page
  if [[ -f "$ROOT/$path" ]]; then
    return 0
  fi
  printf '%s' "$candidate"
  return 1
}

check_internal_links() {
  section "Internal page links (<a href=\"/…\">)"

  local missing=0 total=0

  while IFS= read -r html; do
    [[ -z "$html" ]] && continue
    local rel_html="${html#$ROOT/}"

    while IFS= read -r href; do
      [[ -z "$href" ]] && continue
      [[ "$href" != /* ]] && continue
      ((total++)) || true

      local expected=""
      if ! expected=$(resolve_internal_page "$href"); then
        fail "No page: ${expected:-$href}  (from $rel_html → href=\"$href\")"
        missing=$((missing + 1))
      fi
    done < <(grep -oiE '<a[^>]+href="[^"]+"' "$html" 2>/dev/null \
      | sed -E 's/.*href="([^"]+)".*/\1/' || true)
  done < <(collect_html_files)

  if (( missing == 0 )); then
    pass "$total internal absolute link(s) resolve to index.html"
  fi
}

# ── [5] Sitemap URLs → HTTP 200 (local server) ──
check_sitemap_http() {
  section "Sitemap URLs (HTTP ${BASE})"

  if [[ ! -f "$ROOT/sitemap.xml" ]]; then
    fail "sitemap.xml not found"
    return
  fi

  if ! curl -sf --max-time 2 --head "$BASE/" >/dev/null 2>&1; then
    warn "Local server not running on :${PORT} — skipping sitemap HTTP checks"
    warn "Start with: npm run dev"
    return
  fi

  local urls missing=0 total=0
  urls=$(grep -oE '<loc>[^<]+</loc>' "$ROOT/sitemap.xml" | sed -E 's|<loc>([^<]+)</loc>|\1|')

  while IFS= read -r url; do
    [[ -z "$url" ]] && continue
    ((total++)) || true
    local local_url="${url/https:\/\/tvorteka.lt/${BASE}}"
    local code
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 --head "$local_url" || echo "000")

    if [[ "$code" == "200" ]]; then
      :
    else
      fail "HTTP $code  $local_url  (sitemap: $url)"
      missing=$((missing + 1))
    fi
  done <<< "$urls"

  if (( missing == 0 )); then
    pass "All $total sitemap URL(s) returned HTTP 200"
  fi
}

# ── [6] WebP > 300KB (warning) ──
check_webp_size() {
  section "WebP file sizes (warn if > 300KB)"

  local large=0 total=0

  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    ((total++)) || true
    local size
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
    if (( size > WEBP_WARN_BYTES )); then
      local kb=$(( size / 1024 ))
      warn "${kb}KB  ${file#$ROOT/}"
      large=$((large + 1))
    fi
  done < <(find "$ROOT/assets" -name '*.webp' ! -path '*/_originals/*' -print 2>/dev/null | sort)

  if (( large == 0 )); then
    pass "All $total WebP file(s) ≤ 300KB"
  else
    warn "$large of $total WebP file(s) exceed 300KB (non-fatal)"
  fi
}

# ── [7] _headers & _redirects syntax ──
check_cloudflare_config() {
  section "_headers & _redirects syntax"

  local ok=1

  if [[ ! -f "$ROOT/_headers" ]]; then
    fail "_headers not found"
    ok=0
  else
    local bad=0 line_num=0 line
    while IFS= read -r line || [[ -n "$line" ]]; do
      ((line_num++)) || true
      [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
      if [[ "$line" =~ ^/ ]] || [[ "$line" =~ ^[[:space:]]+[A-Za-z0-9-]+:[[:space:]]+ ]]; then
        :
      else
        fail "_headers line $line_num: unexpected format → $line"
        bad=1
      fi
    done < "$ROOT/_headers"
    if (( bad == 0 )); then
      pass "_headers syntax OK"
    fi
  fi

  if [[ ! -f "$ROOT/_redirects" ]]; then
    fail "_redirects not found"
    ok=0
  else
    local bad=0 line_num=0
    while IFS= read -r line; do
      ((line_num++)) || true
      [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
      if ! [[ "$line" =~ ^[^[:space:]]+[[:space:]]+[^[:space:]]+[[:space:]]+[0-9]{3}[[:space:]]*$ ]]; then
        fail "_redirects line $line_num: invalid format → $line"
        bad=1
      fi
    done < "$ROOT/_redirects"
    if (( bad == 0 )); then
      pass "_redirects syntax OK"
    fi
  fi
}

# ── [8] Required HTML meta ──
check_html_meta() {
  section "Required HTML meta (title, description, canonical, og:image, one H1)"

  local issues=0 total=0

  while IFS= read -r html; do
    [[ -z "$html" ]] && continue
    ((total++)) || true
    local rel="${html#$ROOT/}"
    local content h1_count

    content=$(cat "$html")

    if ! grep -qiE '<title>[^<]+</title>' <<< "$content"; then
      fail "$rel — missing <title>"
      issues=$((issues + 1))
    fi

    if ! grep -qiE '<meta[^>]+name="description"[^>]+content="[^"]+"' <<< "$content" \
       && ! grep -qiE '<meta[^>]+content="[^"]+"[^>]+name="description"' <<< "$content"; then
      fail "$rel — missing meta description"
      issues=$((issues + 1))
    fi

    if ! grep -qiE '<link[^>]+rel="canonical"' <<< "$content"; then
      fail "$rel — missing canonical"
      issues=$((issues + 1))
    fi

    if ! grep -qiE '<meta[^>]+property="og:image"' <<< "$content"; then
      fail "$rel — missing og:image"
      issues=$((issues + 1))
    fi

    h1_count=$(grep -oiE '<h1[^>]*>' <<< "$content" | wc -l | tr -d ' ')
    if [[ "$h1_count" -ne 1 ]]; then
      fail "$rel — expected 1 <h1>, found $h1_count"
      issues=$((issues + 1))
    fi
  done < <(collect_html_files)

  if (( issues == 0 )); then
    pass "All $total HTML page(s) have required meta"
  fi
}

# ── [9] Formspree URL consistency ──
check_formspree() {
  section "Formspree URL consistency"

  local found=() mismatches=0

  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    found+=("$match")
    if [[ "$match" != "$FORMSPREE_CANONICAL" && "$match" != *"/f/xzdowagr" ]]; then
      fail "Unexpected Formspree URL: $match"
      mismatches=$((mismatches + 1))
    fi
  done < <(
    grep -rohE 'https://formspree\.io/f/[A-Za-z0-9]+' \
      index.html kontaktai/index.html js/skaiciuokle.js 2>/dev/null | sort -u
  )

  # JS uses template string — verify ID constant
  if ! grep -q "FORMSPREE_ID = 'xzdowagr'" "$ROOT/js/skaiciuokle.js" 2>/dev/null; then
    fail "js/skaiciuokle.js — FORMSPREE_ID is not 'xzdowagr'"
    mismatches=$((mismatches + 1))
  fi

  if [[ ${#found[@]} -eq 0 ]]; then
    fail "No Formspree URLs found in forms"
    mismatches=$((mismatches + 1))
  elif (( mismatches == 0 )); then
    pass "All forms use $FORMSPREE_CANONICAL (${#found[@]} source(s))"
  fi
}

# ── Main ──
main() {
  echo -e "${C_BOLD}TVORTEKA Preflight${C_RESET}  $(date '+%Y-%m-%d %H:%M')"
  echo "Root: $ROOT"

  check_git_clean
  check_img_src
  check_assets_refs
  check_internal_links
  check_sitemap_http
  check_webp_size
  check_cloudflare_config
  check_html_meta
  check_formspree

  echo ""
  echo -e "${C_BOLD}Summary${C_RESET}"
  if (( FAILS == 0 )); then
    echo -e "  ${C_GREEN}${C_BOLD}READY${C_RESET}  —  $CHECKS sections, ${WARNS} warning(s)"
    exit 0
  else
    echo -e "  ${C_RED}${C_BOLD}BLOCKED${C_RESET}  —  $FAILS failure(s), ${WARNS} warning(s)"
    exit 1
  fi
}

main "$@"
