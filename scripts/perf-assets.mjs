#!/usr/bin/env node
// Fast asset-size analysis of the built dist/ — total size, breakdown by file
// type, per-route HTML + linked-asset weight, and the top-N largest assets.
// No Lighthouse, no preview server. Useful as a quick gut check after a build.
//
// Usage: node scripts/perf-assets.mjs   (run after `npm run build`)

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(root, 'dist');
const ROUTES = ['/', '/blog', '/repos', '/cats', '/resume', '/404'];
const TOP_N = 8;

if (!existsSync(distDir)) {
  console.error('dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

const fmt = (n) =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`;

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = await Promise.all(
    entries.map(async (e) => {
      const p = join(dir, e.name);
      return e.isDirectory() ? listFiles(p) : p;
    }),
  );
  return out.flat();
}

const files = await listFiles(distDir);
const rows = await Promise.all(
  files.map(async (f) => ({
    path: `/${relative(distDir, f)}`,
    ext: extname(f).toLowerCase() || '(none)',
    bytes: (await stat(f)).size,
  })),
);

const total = rows.reduce((s, r) => s + r.bytes, 0);
const byExt = new Map();
for (const r of rows) byExt.set(r.ext, (byExt.get(r.ext) ?? 0) + r.bytes);

console.log(`Total built size: ${fmt(total)}`);
console.log('By extension:');
[...byExt.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([ext, b]) => {
    console.log(`  ${ext.padEnd(8)} ${fmt(b)}`);
  });

console.log('\nRoute weights (HTML + same-origin linked assets):');
const routeHeader = ['route', 'HTML', 'assets', 'initial'];
const routeRows = [];
for (const route of ROUTES) {
  const htmlPath =
    route === '/'
      ? join(distDir, 'index.html')
      : route === '/404'
        ? join(distDir, '404.html')
        : join(distDir, route.replace(/^\//, ''), 'index.html');
  if (!existsSync(htmlPath)) continue;

  const html = await readFile(htmlPath, 'utf8');
  const htmlBytes = Buffer.byteLength(html);
  const linked = new Set();
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const v = m[1].split('?')[0];
    if (v.startsWith('/_astro/') || v.startsWith('/favicon')) linked.add(v);
  }
  let assetBytes = 0;
  for (const a of linked) {
    const p = join(distDir, a);
    if (existsSync(p)) assetBytes += (await stat(p)).size;
  }
  routeRows.push([route, fmt(htmlBytes), fmt(assetBytes), fmt(htmlBytes + assetBytes)]);
}
const widths = routeHeader.map((h, i) => Math.max(h.length, ...routeRows.map((r) => r[i].length)));
const printRow = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
console.log(printRow(routeHeader));
console.log(widths.map((w) => '-'.repeat(w)).join('  '));
routeRows.forEach((r) => console.log(printRow(r)));

console.log(`\nTop ${TOP_N} largest assets:`);
rows
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, TOP_N)
  .forEach((r) => {
    console.log(`  ${fmt(r.bytes).padStart(8)}  ${r.path}`);
  });
