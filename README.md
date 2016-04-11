# [mochajs.org](http://mochajs.org): How to Build the Site

*So you wanna build the site?*

[mochajs.org](http://mochajs.org) is now built using [Jekyll](http://jekyllrb.com), the popular static site generator.

## Prerequisites

1.  Some recent version of Ruby
2.  Some version of [RubyGems](https://rubygems.org)
3.  Some recent version of Node.JS

## Installation

1.  Execute `npm install`.  This will install [Bundler](http://bundler.io), Jekyll, and [markdown-toc-index](https://www.npmjs.com/package/markdown-toc-index).
2.  To build, execute `npm run build` or `make build`

### Problems?

#### Permissions-Related

If `npm install` fails due to an `EACCESS` problem, try this:

```shell
$ sudo gem install bundler
$ npm install --ignore-scripts
$ bundle install
```

#### Ruby-Related on OS X

You may need to install the Xcode command line tools if `bundle install` fails somewhere.  Execute this:

```shell
$ xcode-select --install
```

## Local development

1.  Run `make` to build the project and start a development server that auto-watches for changes on http://localhost:3000

For more information, refer to the [Jekyll Docs](http://jekyllrb.com/docs/home/) and [GitHub's Tutorial](https://help.github.com/articles/using-jekyll-with-pages/) on the subject.

## Notes

- To update `index.md` with the TOC, execute: `node_modules/.bin/toc-idx -i index.md --max-depth 1 --bullet "\- " index.md`
- `bundle exec jekyll build` rebuilds the site without updating the TOC
- The `_site` directory is where the generated site lives.  It is *not* under version control, because GitHub Pages generates it for us.

