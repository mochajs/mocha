# mochajs.org

*So you wanna build the site?*

[mochajs.org](https://mochajs.org) is built using [Jekyll](http://jekyllrb.com), the popular static site generator.

## Prerequisites

- Ruby
- RubyGems
- Bundler (`gem install bundler`)
- Node.js v4.0.0 or greater

## Development

1. Run `npm install` from working copy root to get Node.js deps.
1. Run `bundle install` to install Jekyll and its dependencies.  This may or may not require elevated privileges, depending on your system.
1. To serve the site and rebuild as changes are made, execute `npm run docs.watch`.
1. To rebuild the site *once*, execute `npm start docs.build`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- This file (`docs/README.md`) should *not* be included in the build.
- `docs/index.md` may be mutated upon build, depending on what `scripts/docs-update-toc.js` does.  If it updates the table of contents (because of your changes), **you must commit `docs/index.md`**.
- `docs/_site/` is where the generated static site lives (and is what you see at [mochajs.org](https://mochajs.org)).  It is *not* under version control.

## License

:copyright: 2016-2018 [JS Foundation](https://js.foundation) and contributors.

Content licensed [CC-BY-4.0](https://raw.githubusercontent.com/mochajs/mocha/master/docs/LICENSE-CC-BY-4.0).

Code licensed [MIT](https://raw.githubusercontent.com/mochajs/mocha/master/LICENSE-MIT).
