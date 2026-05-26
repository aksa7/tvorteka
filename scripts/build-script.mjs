#!/usr/bin/env node
/**
 * TVORTEKA production build
 * - Minifies css/*.css → css/*.min.css (lightningcss)
 * - Minifies js/*.js → js/*.min.js (terser)
 * - Outputs deployable ./dist/ with HTML pointing at .min assets
 * Source HTML/CSS/JS in repo root are never overwritten.
 */

import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');

const CSS_FILES = ['tokens', 'main', 'apie', 'kontaktai', 'skaiciuokle'];
const JS_FILES = ['main', 'apie', 'kontaktai', 'skaiciuokle'];

const BIN = (name) => join(ROOT, 'node_modules', '.bin', name);

function run(cmd, args) {
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
}

function minifyAssets() {
  console.log('→ Minifying CSS (lightningcss)…');
  for (const file of CSS_FILES) {
    const input = join(ROOT, 'css', `${file}.css`);
    const output = join(ROOT, 'css', `${file}.min.css`);
    if (!existsSync(input)) {
      console.warn(`  skip missing ${relative(ROOT, input)}`);
      continue;
    }
    run(BIN('lightningcss'), ['--minify', input, '-o', output]);
  }

  console.log('→ Minifying JS (terser)…');
  for (const file of JS_FILES) {
    const input = join(ROOT, 'js', `${file}.js`);
    const output = join(ROOT, 'js', `${file}.min.js`);
    if (!existsSync(input)) {
      console.warn(`  skip missing ${relative(ROOT, input)}`);
      continue;
    }
    run(BIN('terser'), [input, '-o', output, '-c', '-m']);
  }
}

function patchHtml(html) {
  let out = html;
  for (const file of CSS_FILES) {
    out = out.replaceAll(`${file}.css`, `${file}.min.css`);
  }
  for (const file of JS_FILES) {
    out = out.replaceAll(`${file}.js`, `${file}.min.js`);
  }
  return out;
}

function copyIfExists(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

function copyAssets() {
  const assetsSrc = join(ROOT, 'assets');
  const assetsDest = join(DIST, 'assets');
  mkdirSync(assetsDest, { recursive: true });

  for (const entry of readdirSync(assetsSrc)) {
    if (entry === '_originals') continue;
    const srcPath = join(assetsSrc, entry);
    const destPath = join(assetsDest, entry);
    cpSync(srcPath, destPath, { recursive: true });
  }
}

function collectHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full);
    if (rel.startsWith('node_modules') || rel.startsWith('dist') || rel.startsWith('scripts')) {
      continue;
    }
    const st = statSync(full);
    if (st.isDirectory()) {
      collectHtmlFiles(full, acc);
    } else if (entry === 'index.html') {
      acc.push(full);
    }
  }
  return acc;
}

function buildDist() {
  console.log('→ Building dist/…');
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });

  copyAssets();

  for (const file of CSS_FILES) {
    copyIfExists(join(ROOT, 'css', `${file}.min.css`), join(DIST, 'css', `${file}.min.css`));
  }
  for (const file of JS_FILES) {
    copyIfExists(join(ROOT, 'js', `${file}.min.js`), join(DIST, 'js', `${file}.min.js`));
  }

  const staticRootFiles = [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'site.webmanifest',
    '_headers',
    '_redirects',
    'robots.txt',
    'sitemap.xml',
  ];
  for (const file of staticRootFiles) {
    copyIfExists(join(ROOT, file), join(DIST, file));
  }

  for (const htmlPath of collectHtmlFiles(ROOT)) {
    const rel = relative(ROOT, htmlPath);
    const dest = join(DIST, rel);
    mkdirSync(dirname(dest), { recursive: true });
    const patched = patchHtml(readFileSync(htmlPath, 'utf8'));
    writeFileSync(dest, patched);
  }

  console.log(`  dist/ ready (${collectHtmlFiles(DIST).length} HTML pages)`);
}

function main() {
  for (const bin of ['lightningcss', 'terser']) {
    if (!existsSync(BIN(bin))) {
      console.error(`ERROR: ${bin} not found. Run: npm install`);
      process.exit(1);
    }
  }

  minifyAssets();
  buildDist();
  console.log('✓ Build complete. Deploy ./dist/ to Cloudflare Pages.');
}

main();
