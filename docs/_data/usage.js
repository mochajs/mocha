'use strict';

const stripAnsi = require('strip-ansi');
const {resolve} = require('path');
const {execSync} = require('child_process');

const executable = require.resolve('../../bin/mocha');
const flag = '--help';

/**
 * Return the output of `mocha --help` for display
 */
module.exports = () => {
  return stripAnsi(
    String(
      execSync(`"${process.execPath}" ${executable} ${flag}`, {
        cwd: resolve(__dirname, '..')
      })
    ).trim()
  );
};
