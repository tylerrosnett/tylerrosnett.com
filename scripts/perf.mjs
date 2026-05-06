#!/usr/bin/env node
// Run Lighthouse against a list of local URLs N times each per device and print
// the median of key metrics. Raw reports are saved under .perf/<timestamp>/.
//
// Usage:
//   node scripts/perf.mjs                    # default: 3 runs per page, desktop + mobile
//   RUNS=5 node scripts/perf.mjs             # override run count
//   BASE=http://127.0.0.1:4321 node ...      # override base URL
//   PAGES=/,/blog node scripts/perf.mjs      # comma-separated page list
//   DEVICES=desktop node scripts/perf.mjs    # filter devices (desktop,mobile)

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const RUNS = Number(process.env.RUNS || 3);
const PAGES = (process.env.PAGES || '/,/blog,/blog/hello-world,/cats,/repos,/resume').split(',');
const DEVICES = (process.env.DEVICES || 'desktop,mobile').split(',');

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = join('.perf', ts);
await mkdir(outDir, { recursive: true });

const median = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
};

const fmtMs = (n) => (n == null ? '-' : Math.round(n).toString());
const fmt2 = (n) => (n == null ? '-' : n.toFixed(3));
const fmtKb = (bytes) => (bytes == null ? '-' : Math.round(bytes / 1024).toString());

const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

const allResults = [];
try {
  for (const device of DEVICES) {
    // mobile is Lighthouse's default — only set preset for desktop.
    const lhOpts = device === 'desktop' ? { preset: 'desktop' } : {};
    process.stdout.write(`\n[${device}]`);
    for (const page of PAGES) {
      const url = BASE + page;
      const runs = [];
      process.stdout.write(`\n  ${page}  `);
      for (let i = 0; i < RUNS; i++) {
        const result = await lighthouse(url, {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          onlyCategories: ['performance'],
          ...lhOpts,
        });
        const lhr = result.lhr;
        const audits = lhr.audits;
        runs.push({
          score: Math.round((lhr.categories.performance.score ?? 0) * 100),
          lcp: audits['largest-contentful-paint']?.numericValue,
          fcp: audits['first-contentful-paint']?.numericValue,
          cls: audits['cumulative-layout-shift']?.numericValue,
          tbt: audits['total-blocking-time']?.numericValue,
          si: audits['speed-index']?.numericValue,
          bytes: audits['total-byte-weight']?.numericValue,
          requests: audits['network-requests']?.details?.items?.length,
        });
        const slug = page.replace(/\//g, '_') || '_root';
        await writeFile(
          join(outDir, `${slug.replace(/^_/, '')}-${device}-run${i + 1}.json`),
          result.report,
        );
        process.stdout.write('.');
      }
      allResults.push({
        device,
        page,
        score: median(runs.map((r) => r.score)),
        lcp: median(runs.map((r) => r.lcp)),
        fcp: median(runs.map((r) => r.fcp)),
        cls: median(runs.map((r) => r.cls)),
        tbt: median(runs.map((r) => r.tbt)),
        si: median(runs.map((r) => r.si)),
        bytes: median(runs.map((r) => r.bytes)),
        requests: median(runs.map((r) => r.requests)),
      });
    }
  }
} finally {
  await chrome.kill();
}

console.log('\n');
const header = ['page', 'score', 'LCP(ms)', 'FCP(ms)', 'CLS', 'TBT(ms)', 'SI(ms)', 'KB', 'reqs'];

for (const device of DEVICES) {
  const deviceRows = allResults.filter((r) => r.device === device);
  if (deviceRows.length === 0) continue;
  const rows = deviceRows.map((r) => [
    r.page,
    r.score.toString(),
    fmtMs(r.lcp),
    fmtMs(r.fcp),
    fmt2(r.cls),
    fmtMs(r.tbt),
    fmtMs(r.si),
    fmtKb(r.bytes),
    r.requests?.toString() ?? '-',
  ]);
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const printRow = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
  console.log(`\n## ${device}\n`);
  console.log(printRow(header));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  rows.forEach((r) => console.log(printRow(r)));
}

await writeFile(join(outDir, 'summary.json'), JSON.stringify(allResults, null, 2));
console.log(`\nReports saved to ${outDir}`);
