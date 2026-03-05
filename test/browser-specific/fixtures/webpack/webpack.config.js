

import FailOnErrorsWebpackPlugin from 'fail-on-errors-webpack-plugin';
import os from 'node:os';
import path from 'node:path';

const outputPath = path.join(os.tmpdir(), 'mocha-test-webpack');

console.error('output dir: %s', outputPath);

export default {
  entry: require.resolve('./webpack.fixture.mjs'),
  target: 'browserslist:last 2 Chrome versions',
  output: {
    path: outputPath,
    chunkFormat: 'commonjs'
  },
  plugins: [
    new FailOnErrorsWebpackPlugin({
      failOnErrors: true,
      failOnWarnings: false
    })
  ]
};
