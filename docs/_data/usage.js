'use strict';

const {stripVTControlCharacters} = require('util');
const {resolve} = require('path');
const {execSync} = require('child_process');

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
