# mochajs.org

_So you wanna build the site?_

[mochajs.org](https://mochajs.org) is built using [Eleventy](https://www.11ty.io/), a simple static site generator.

## Prerequisites

- Node.js v6.x or greater

## Development

1. Run `npm install` from working copy root to get Node.js deps.
1. To serve the site and rebuild as changes are made, execute `npm start docs.watch`.
1. To rebuild the site _once_, execute `npm start docs`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- This file (`docs/README.md`) should _not_ be included in the build.
- `docs/_dist` is where the deployed site lives. `docs/_site` is essentially a build step. These directories are _not_ under version control.
- See `package-scripts.js` for details on what the builds are actually doing; especially see [markdown-magic](https://npm.im/markdown-magic) for how we're dynamically inserting information into `docs/index.md`.

## License

:copyright: 2016-2018 [JS Foundation](https://js.foundation) and contributors.

Content licensed [CC-BY-4.0](https://raw.githubusercontent.com/mochajs/mocha/master/docs/LICENSE-CC-BY-4.0).

Code licensed [MIT](https://raw.githubusercontent.com/mochajs/mocha/master/LICENSE-MIT).
