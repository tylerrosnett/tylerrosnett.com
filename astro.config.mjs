// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwind()],
  },

  adapter: cloudflare(),
});