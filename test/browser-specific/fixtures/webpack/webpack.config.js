'use strict';

const {tmpdir} = require('node:os');
const {join} = require('node:path');

const outputPath = join(tmpdir(), 'mocha-test-webpack');

console.error('output dir: %s', outputPath);

module.exports = {
  bail: true,
  entry: require.resolve('./webpack.fixture.mjs'),
  target: 'browserslist:last 2 Chrome versions',
  output: {
    path: outputPath,
    chunkFormat: 'commonjs'
  },
};
