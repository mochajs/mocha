#!/usr/bin/env node
'use strict';

/**
 * Mocha's build script which is sadly too complex to manage from the command
 * line
 * @type {Browserify}
 */

const browserify = require('browserify');
const path = require('path');
const dedefine = require('./dedefine');
const aliasify = require('aliasify');

const options = {
  basedir: path.join(__dirname, '..'),
  entries: ['./browser-entry.js'],
  insertGlobalVars: {
    Buffer (file, basedir) {
      const filepath = path.join(path.relative(path.dirname(file), basedir),
        'node_modules',
        'buffer');
      return `require('${filepath}').Buffer`;
    }
  }
};

const build = (b) => b.ignore('fs')
  .ignore('glob')
  .ignore('path')
  .ignore('supports-color')
  .transform(aliasify, {
    replacements: {
      '^buffer/?': () => require.resolve('buffer/index.js')
    },
    global: true
  })
  .plugin(dedefine);

exports.build = build;
exports.options = options;

if (require.main === module) {
  build(browserify(options)).bundle()
    .pipe(process.stdout);
}
