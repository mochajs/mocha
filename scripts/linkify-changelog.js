'use strict';

/**
 * Linkify CHANGELOG.md
 */

const {writeFileSync} = require('fs');
const vfile = require('to-vfile');
const remark = require('remark');

const filepath = require.resolve('../CHANGELOG.md');

writeFileSync(
  filepath,
  remark()
    .data('settings', {
      listItemIndent: '1',
      incrementListMarker: false,
      gfm: false,
      entities: false
    })
    .use([require('remark-inline-links'), require('remark-github')])
    .processSync(vfile.readSync(filepath))
    .toString()
);
