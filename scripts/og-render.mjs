#!/usr/bin/env node
// Rasterize scripts/og.svg → public/og.png at 1200x630.
// Run after editing the SVG: `npm run og`.

import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = join(root, 'scripts/og.svg');
const pngPath = join(root, 'public/og.png');

const svg = await readFile(svgPath);
await sharp(svg, { density: 300 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(pngPath);

const { size } = await stat(pngPath);
console.log(`${pngPath} written (${size} bytes)`);
