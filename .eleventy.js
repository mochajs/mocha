'use strict';

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(
    require('@11ty/eleventy-plugin-inclusive-language'),
    {
      words:
        'simply,obviously,basically,of course,clearly,everyone knows,however,easy'
    }
  );

  eleventyConfig.addPassthroughCopy('docs/css');
  eleventyConfig.addPassthroughCopy('docs/js');
  eleventyConfig.addPassthroughCopy('docs/images');
  eleventyConfig.addPassthroughCopy('docs/CNAME');
  eleventyConfig.addPassthroughCopy('docs/_headers');
  eleventyConfig.addPassthroughCopy('docs/favicon.ico');
  eleventyConfig.addPassthroughCopy('docs/example');

  /* Markdown Plugins */
  const markdown = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
  });

  markdown.use(require('markdown-it-anchor'), {
    slugify: require('uslug'),
    permalink: true,
    permalinkBefore: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#'
  });

  markdown.use(require('markdown-it-attrs'), {
    leftDelimiter: '{:',
    rightDelimiter: '}'
  });

  markdown.use(require('markdown-it-prism'));

  markdown.use(require('markdown-it-emoji'));

  eleventyConfig.setLibrary('md', markdown);

  return {
    passthroughFileCopy: true,
    dir: {
      input: 'docs',
      includes: '_includes',
      output: 'docs/_site'
    }
  };
};
