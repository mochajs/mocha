# mochajs.org

These are the docs for the classic version of mochajs.org. For the Astro site released in 2025, see docs-next.

The classic [mochajs.org](https://mochajs.org) is built using [Eleventy](https://www.11ty.io/), a simple static site generator.

## Development

1. Run `npm install` / `npm ci` from working copy root to get Node.js deps.
1. To include the API documentation, run `npm run docs:api` before the either of the following commands.
1. To serve the site and rebuild as changes are made, run `npm run docs-watch`.
1. To rebuild the site _once_, run `npm run docs`. This also builds the Astro site.
1. To preview the site, run `npm run docs:preview`. The Astro site is available at `/next`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- This file (`docs/README.md`) should _not_ be included in the build.
- `docs/_site_` is where the deployed site lives. This directory is _not_ under version control.
