# mochajs.org

_So you wanna build the site?_

[mochajs.org](https://mochajs.org) is built using [Eleventy](https://www.11ty.io/), a simple static site generator.

## Development

1. Run `npm install` / `npm ci` from working copy root to get Node.js deps.
1. To serve the site and rebuild as changes are made, execute `npm run docs-watch`.
1. To rebuild the site _once_, execute `npm run docs`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- This file (`docs/README.md`) should _not_ be included in the build.
- `docs/_site_` is where the deployed site lives. This directories are _not_ under version control.
