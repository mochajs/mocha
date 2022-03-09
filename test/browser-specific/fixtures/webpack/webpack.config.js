'use strict';

const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');
const {tmpdir} = require('os');
const {join} = require('path');

const outputPath = join(tmpdir(), 'mocha-test-webpack');

console.error('output dir: %s', outputPath);

module.exports = {
  entry: require.resolve('./webpack.fixture.mjs'),
  target: 'browserslist:last 2 Chrome versions or IE 11',
  output: {
    path: outputPath
  },
  plugins: [
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: false
    })
  ]
};
