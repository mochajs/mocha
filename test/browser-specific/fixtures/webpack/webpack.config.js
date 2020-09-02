'use strict';

const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const {tmpdir} = require('os');
const {join} = require('path');

const outputPath = join(tmpdir(), 'mocha-test-webpack');

console.error('output dir: %s', outputPath);

module.exports = {
  entry: require.resolve('./webpack.fixture.mjs'),
  output: {
    path: outputPath
  },
  plugins: [
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: true
    })
  ]
};
