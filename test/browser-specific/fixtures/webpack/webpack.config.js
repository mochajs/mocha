'use strict';

const FailOnErrorsPlugin = require('fail-on-errors-webpack-plugin');

module.exports = {
  entry: require.resolve('./webpack.fixture.mjs'),
  plugins: [
    new FailOnErrorsPlugin({
      failOnErrors: true,
      failOnWarnings: true
    })
  ]
};
