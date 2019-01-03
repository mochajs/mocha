module.exports = function (config) {
  config.addPassthroughCopy("docs/css");
  config.addPassthroughCopy("docs/js");
  config.addPassthroughCopy("docs/images");
  config.addPassthroughCopy("docs/CNAME");
  config.addPassthroughCopy("docs/_headers");

  return {
    passthroughFileCopy: true,
    dir: {
      input: "docs",
      includes: "_includes",
      output: "docs/_site"
    }
  };
};
