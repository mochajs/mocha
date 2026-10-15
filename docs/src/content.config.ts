import { defineCollection } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";
import { blogSchema } from "starlight-blog/schema";

export const collections = {
  docs: defineCollection({
    loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
    schema: docsSchema({
      extend: (context) => blogSchema(context),
    }),
  }),
};
