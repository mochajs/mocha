'use strict';

const {stripVTControlCharacters} = require('node:util');
const {resolve} = require('node:path');
const {execSync} = require('node:child_process');

const executable = require.resolve('../../bin/mocha');
const flag = '--help';

/**
 * Return the output of `mocha --help` for display
 */
module.exports = () => {
  return stripVTControlCharacters(
    String(
      execSync(`"${process.execPath}" ${executable} ${flag}`, {
        cwd: resolve(__dirname, '..')
      })
    ).trim()
  );
};
