#!/usr/bin/env node
/**
 * TVORTEKA local quality checks
 * 1. html-validate on source HTML
 * 2. linkinator against local dev server (broken link check)
 */

import { spawn, execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = 5500;
const BASE = `http://127.0.0.1:${PORT}`;

const BIN = (name) => join(ROOT, 'node_modules', '.bin', name);

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
    } else if (entry.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

function runHtmlValidate() {
  console.log('→ HTML validate…');
  if (!existsSync(BIN('html-validate'))) {
    console.error('ERROR: html-validate not found. Run: npm install');
    process.exit(1);
  }
  const files = collectHtmlFiles(ROOT);
  execFileSync(BIN('html-validate'), [...files, '--config', join(ROOT, '.htmlvalidate.json')], {
    cwd: ROOT,
    stdio: 'inherit',
  });
}

function waitForServer(ms = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = async () => {
      try {
        const res = await fetch(BASE);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > ms) return reject(new Error('Dev server did not start in time'));
      setTimeout(tick, 200);
    };
    tick();
  });
}

function runLinkinator(server) {
  return new Promise((resolve, reject) => {
    console.log(`→ Link check (${BASE})…`);
    if (!existsSync(BIN('linkinator'))) {
      server.kill();
      reject(new Error('linkinator not found. Run: npm install'));
      return;
    }

    const child = spawn(
      BIN('linkinator'),
      [
        BASE,
        '--recurse',
        '--skip', 'mailto:,tel:,javascript:',
        '--verbosity', 'error',
      ],
      { cwd: ROOT, stdio: 'inherit' },
    );

    child.on('close', (code) => {
      server.kill('SIGTERM');
      if (code === 0) resolve();
      else reject(new Error(`linkinator exited with code ${code}`));
    });
  });
}

async function main() {
  console.log('→ Starting temporary dev server…');
  const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
  });

  try {
    runHtmlValidate();
    await waitForServer();
    await runLinkinator(server);
    console.log('✓ All checks passed.');
  } catch (err) {
    server.kill('SIGTERM');
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
