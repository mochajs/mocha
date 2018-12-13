# mochajs.org

*So you wanna build the site?*

[mochajs.org](https://mochajs.org) is built using [Jekyll](http://jekyllrb.com), the popular static site generator.

## Prerequisites

- Ruby
- RubyGems
- Bundler (`gem install bundler`)
- Node.js v6.x or greater

## Development

1. Run `npm install` from working copy root to get Node.js deps.
1. Run `bundle install` to install Jekyll and its dependencies.  This may or may not require elevated privileges, depending on your system.
1. To serve the site and rebuild as changes are made, execute `npm start docs.watch`.
1. To rebuild the site *once*, execute `npm start docs`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- This file (`docs/README.md`) should *not* be included in the build.
- `docs/_dist` and `docs/api` are where the deployed site lives.  `does/_site` is essentially a build step.  These three directories are *not* under version control.
- See `package-scripts.js` for details on what the builds are actually doing; especially see [markdown-magic](https://npm.im/markdown-magic) for how we're dynamically inserting information into `docs/index.md`.

## License

:copyright: 2016-2018 [JS Foundation](https://js.foundation) and contributors.

Content licensed [CC-BY-4.0](https://raw.githubusercontent.com/mochajs/mocha/master/docs/LICENSE-CC-BY-4.0).

Code licensed [MIT](https://raw.githubusercontent.com/mochajs/mocha/master/LICENSE-MIT).
