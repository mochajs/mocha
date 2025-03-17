'use strict';

const {resolve, relative, dirname} = require('node:path');
const {promises: fs} = require('node:fs');

const PROJECT_ROOT_DIR = resolve(__dirname, '..', '..');
const FILES = [
  {
    slug: 'simplereporter',
    path: require.resolve('../../test/integration/fixtures/simple-reporter.js'),
    header: '// my-reporter.js'
  }
];

const loadFile = async (path, {header} = {}) => {
  const relativeDir = relative(dirname(path), PROJECT_ROOT_DIR);
  let content = await fs.readFile(path, 'utf-8');
  // replace relative paths in `require()` to root with "mocha".
  // might not work in the general case. not gonna parse an AST for this
  // e.g. `require('../../lib/foo')` => `require('mocha/lib/foo')`
  // also trim any trailing whitespace
  content = content
    .replace(
      new RegExp(`require\\(['"]${relativeDir}(.*?)['"]\\)`, 'g'),
      "require('mocha$1')"
    )
    .trim();
  return `${header}\n\n${content}`;
};

/**
 * Loads files from disk (see `FILES` above) to be shown as data.
 * Used for embedding sources directly into pages
 */
module.exports = async () => {
  const files = [];
  for await (const {path, header, slug} of FILES) {
    const content = await loadFile(path, {header});
    files.push({slug, content});
  }
  return files.reduce(
    (files, {slug, content}) => ({
      ...files,
      [slug]: content
    }),
    {}
  );
};
