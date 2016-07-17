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
const filepath = path.join(__dirname, '..', 'index.md');

console.log('Updating TOC...');

const input = fs.createReadStream(filepath);

input.pipe(
    utils.concat(input => fs.writeFileSync(filepath, toc.insert(String(input), {
      bullets: '-',
      maxdepth: 2
    }))));

input.on('error', err => {
  console.log(err);
  process.exit(1);
});

input.on('close', () => {
  console.log('Done.');
  process.exit();
});
