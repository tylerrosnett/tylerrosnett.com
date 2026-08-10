import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // *.draft.md is excluded so a local `npm run deploy` can never publish drafts
  // (they are gitignored, so git-based deploys already never see them).
  loader: glob({ pattern: ['*.md', '!*.draft.md'], base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
});

export const collections = { blog };
