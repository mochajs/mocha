# [mochajs.org](http://mochajs.org): How to Build the Site

*So you wanna build the site?*

mochajs.org is now built using [Jekyll](http://jekyllrb.com), the popular static site generator.

## Prerequisites

1.  Some recent version of Ruby
2.  A recent version of Node.JS
3.  [Bundler](http://bundler.io)

  To install Bundler, after installing Ruby, execute `gem install bundler`.
  
4. Now, execute `npm install`.  This will install Jekyll and a bunch of other
   crap we need.
   
5. To build, execute `npm run-script build`.

For more information, refer to the [Jekyll Docs](http://jekyllrb.com/docs/home/) and [GitHub's Tutorial](https://help.github.com/articles/using-jekyll-with-pages/) on the subject. 

## Notes

- The TOC is generated with [marked-toc](https://www.npmjs.com/package/marked-toc).
- The `id` attributes for all of the headers are generated with JavaScript.
- The `_site` directory is where the generated site lives.  It is *not* under version control, because GitHub Pages generates it for us.

