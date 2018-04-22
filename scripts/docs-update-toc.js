#!/usr/bin/env node

/**
 * The CLI included with markdown-toc doesn't support `bullets`
 * and `maxdepth` options, so that's why this exists.
 */

'use strict';

const toc = require('markdown-toc');
const utils = require('markdown-toc/lib/utils');
const fs = require('fs');
const path = require('path');

const docsFilepath = path.join(__dirname, '..', 'docs', 'index.md');

console.log('Updating TOC...');

fs
  .createReadStream(docsFilepath)
  .on('error', err => {
    console.log(err);
    process.exit(1);
  })
  .on('close', () => {
    console.log('Done.');
  })
  .pipe(
    utils.concat(input => {
      const output = toc
        .insert(String(input), {
          bullets: '-',
          maxdepth: 2
        })
        .replace(/\n\n$/, '\n');
      return fs.writeFileSync(docsFilepath, output);
    })
  );
