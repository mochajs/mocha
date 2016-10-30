# mochajs.org

*So you wanna build the site?*

[mochajs.org](https://mochajs.org) is built using [Jekyll](http://jekyllrb.com), the popular static site generator.

## Prerequisites

- Ruby
- RubyGems
- Bundler
- (Optional) Node.js v4.0.0 or greater

## Development

1.  Clone this repo
2.  Execute `npm install` and follow the directions.

> Mac users: You may need to install Xcode command line tools if `bundle install` fails.  Execute `xcode-select --install` if so.

### Notes

- Node.js is only necessary if you need to rebuild the table of contents.
- To serve the site and rebuild as changes are made, execute `npm start serve`.
- To rebuild the site *once*, execute `npm start build`.
- To update the table of contents, execute: `npm start toc`.  This will only alter `index.md`; it will not rebuild the site unless `npm start serve` is running in another process.
- The `_site` directory is where the generated static site lives (and is what you see at [mochajs.org](https://mochajs.org)).  It is *not* under version control.
- `Gemfile.lock` is ignored as to always get the latest `github-pages` gem.

## License

:copyright: 2016 [JS Foundation](https://js.foundation) and contributors.

Content licensed [CC-BY-4.0](https://raw.githubusercontent.com/mochajs/mochajs.github.io/master/LICENSE-CC-BY-4.0).

Code licensed [MIT](https://raw.githubusercontent.com/mochajs/mochajs.github.io/master/LICENSE-MIT).
