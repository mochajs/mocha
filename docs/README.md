# mochajs.org

*So you wanna build the site?*

[mochajs.org](https://mochajs.org) is built using [Jekyll](http://jekyllrb.com), the popular static site generator.

## Prerequisites

- Ruby
- RubyGems
- Bundler (`gem install bundler`)
- Node.js v4.0.0 or greater

## Development

1. Run `npm install` to get Node.js deps.
1. Run `bundle install` to install Jekyll and its dependencies.  This may or may not require elevated privileges, depending on your system.
1. To serve the site and rebuild as changes are made, execute `npm run serveDocs`.
1. To rebuild the site *once*, execute `npm start buildDocs`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- `docs/index.md` may be mutated upon build.  If you update the table of contents, **you must commit `index.md`**; GitHub won't do it for you.
- `docs/_site/` is where the generated static site lives (and is what you see at [mochajs.org](https://mochajs.org)).  It is *not* under version control.

## License

:copyright: 2016-2017 [JS Foundation](https://js.foundation) and contributors.

Content licensed [CC-BY-4.0](https://raw.githubusercontent.com/mochajs/mocha/master/docs/LICENSE-CC-BY-4.0).

Code licensed [MIT](https://raw.githubusercontent.com/mochajs/mocha/master/LICENSE-MIT).
