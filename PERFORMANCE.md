# Performance

Tracks Lighthouse measurements for the production build of tylerrosnett.com over time.

## Methodology

- Build: `npm run build`
- Serve: `npm run perf:serve` (astro preview on `127.0.0.1:4321`, no Cloudflare in front)
- Measure: `npm run perf` — runs Lighthouse 13 against each page 3 times **per device (desktop and mobile)**, takes the median per metric, and writes raw reports to `.perf/<timestamp>/`. Reports are named `<page>-<device>-run<N>.json`; `summary.json` is a flat array with a `device` field.
- Asset-only check: `npm run perf:assets` — fast post-build sanity check. No Lighthouse, no preview server. Prints total `dist/` size, breakdown by extension, per-route HTML+linked-asset weight, and the top-8 largest assets. Useful for catching bundle regressions without paying the full Lighthouse cost.
- Pages tested: `/`, `/blog`, `/blog/hello-world`, `/repos`, `/resume`

Override with env vars: `BASE=...`, `PAGES=/,/blog`, `RUNS=5`, `DEVICES=desktop` (or `mobile`).

### Columns

| Column   | Meaning                                                     |
| -------- | ----------------------------------------------------------- |
| score    | Lighthouse Performance score (0–100)                        |
| LCP      | Largest Contentful Paint (ms) — lower is better             |
| FCP      | First Contentful Paint (ms)                                 |
| CLS      | Cumulative Layout Shift (unitless) — lower is better        |
| TBT      | Total Blocking Time (ms)                                    |
| SI       | Speed Index (ms)                                            |
| KB       | Total transferred bytes                                     |
| reqs     | Number of network requests                                  |

## History

### 2026-05-05 — Baseline (commit 7b69296)

| page              | score | LCP  | FCP | CLS   | TBT | SI  | KB  | reqs |
| ----------------- | ----- | ---- | --- | ----- | --- | --- | --- | ---- |
| /                 | 100   | 1356 | 756 | 0.000 | 0   | 756 | 45  | 9    |
| /blog             | 100   | 1055 | 754 | 0.000 | 0   | 754 | 27  | 8    |
| /blog/hello-world | 100   | 1054 | 753 | 0.000 | 0   | 753 | 31  | 8    |
| /cats             | 83    | 4803 | 753 | 0.000 | 0   | 753 | 716 | 12   |
| /repos            | 95    | 1685 | 753 | 0.127 | 0   | 753 | 31  | 9    |
| /resume           | 100   | 1054 | 753 | 0.000 | 0   | 753 | 33  | 8    |

**Observations:**
- `/cats` is the biggest hit — `cats-ori.webp` is 574 KB after Astro's webp conversion. No responsive `srcset`, no AVIF, all four images set to `loading="eager"`.
- `/repos` shifts layout (CLS 0.127) because the GitHub repo list is fetched client-side and rendered after first paint.
- `/` LCP is the `tyler.jpg` portrait (~17 KB webp). Could be preloaded.
- All pages share a 58 KB CSS bundle (`Base.BfwS1VmV.css`) — Tailwind output. Worth verifying that's tree-shaken.

### 2026-05-05 — After optimizations 1–4

| page              | score | LCP  | FCP | CLS   | TBT | SI  | KB | reqs |
| ----------------- | ----- | ---- | --- | ----- | --- | --- | -- | ---- |
| /                 | 100   | 1053 | 753 | 0.000 | 0   | 753 | 33 | 4    |
| /blog             | 100   | 902  | 752 | 0.000 | 0   | 752 | 15 | 3    |
| /blog/hello-world | 100   | 902  | 752 | 0.000 | 0   | 752 | 15 | 3    |
| /cats             | 100   | 1278 | 753 | 0.000 | 0   | 753 | 84 | 7    |
| /repos            | 100   | 902  | 752 | 0.000 | 0   | 752 | 15 | 3    |
| /resume           | 100   | 902  | 752 | 0.000 | 0   | 752 | 17 | 3    |

**Deltas vs baseline:**
- `/`: LCP −303 ms, KB −12 (−27%), reqs −5
- `/blog`: LCP −153 ms, KB −12 (−44%), reqs −5
- `/blog/hello-world`: LCP −152 ms, KB −16 (−52%), reqs −5
- **`/cats`: score 83→100, LCP −3525 ms (−73%), KB −632 (−88%), reqs −5**
- **`/repos`: score 95→100, LCP −783 ms (−46%), CLS 0.127→0, KB −16 (−52%), reqs −6**
- `/resume`: LCP −152 ms, KB −16 (−48%), reqs −5

## Changelog

_(Append a row to History after each change. Note what changed and the delta.)_

- **2026-05-05** — Baseline established.
- **2026-05-05** — `/cats`: switched `<Image>` → `<Picture>` with AVIF+WebP and `widths={[400,600,800,1200]}`; only the first cat is `loading="eager"` (with `fetchpriority="high"`), the other three are `loading="lazy"`. Cuts `/cats` page weight from 716 KB → 84 KB.
- **2026-05-05** — `/repos`: moved GitHub API fetch from client-side to build-time (Astro frontmatter) and rendered with the existing `RepoCard` component. Eliminates CLS 0.127 and the runtime fetch.
- **2026-05-05** — `/`: added `fetchpriority="high"` and `widths`/`sizes` to the tyler portrait `<Image>` so the LCP image is requested with high priority.
- **2026-05-05** — `Base.astro`: removed the four eager `<link rel="prefetch">` entries and the favicon `<link rel="preload">`. The hover-prefetch handler still covers same-session navigation; this drops 5 requests per page on first paint.
- **2026-05-05** — Tooling: `scripts/perf.mjs` now iterates desktop + mobile by default (still median-of-3). Added `scripts/perf-assets.mjs` and `npm run perf:assets` for a fast Lighthouse-free build inspection (total bytes, by-extension, per-route weight, top-8 assets).
- **2026-05-05** — `Base.astro`: hardened the hover-prefetch handler — switched to `pointerover`, defers prefetch with `requestIdleCallback`, skips when `Save-Data` or `2g` is detected, and ignores same-page hash links.

## Open ideas / backlog

- [ ] Verify Tailwind output is tree-shaken (CSS bundle was 58 KB at baseline — re-check after a fresh build).
- [ ] Consider an `_headers` / Workers cache config for `/_astro/*` (`immutable, max-age=31536000`). Out of scope for current local-only measurement.
- [x] ~~Re-measure on a throttled mobile preset~~ — `npm run perf` now runs both desktop and mobile by default. Re-baseline mobile numbers next run.
- [ ] Add a CI check that fails the build if any page drops below score 95 or LCP exceeds 1500 ms.
