'use strict';

module.exports =
  +process.versions.node.split('.')[0] === 10
    ? '../../lib/entrypoints/'
    : 'mocha';
