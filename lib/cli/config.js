'use strict';

/**
 * Responsible for loading / finding Mocha's "rc" files.
 * This doesn't have anything to do with `mocha.opts`.
 *
 * @private
 * @module
 */

const fs = require('fs');
const findUp = require('findup-sync');
const path = require('path');
const debug = require('debug')('mocha:cli:config');

/**
 * These are the valid config files, in order of precedence;
 * e.g., if `.mocharc.js` is present, then `.mocharc.yaml` and the rest
 * will be ignored.
 * The user should still be able to explicitly specify a file.
 * @private
 */
exports.CONFIG_FILES = [
  '.mocharc.js',
  '.mocharc.yaml',
  '.mocharc.yml',
  '.mocharc.json'
];

/**
 * Parsers for various config filetypes.  Each accepts a filepath and
 * returns an object (but could throw)
 */
const parsers = (exports.parsers = {
  yaml: filepath =>
    require('js-yaml').safeLoad(fs.readFileSync(filepath, 'utf8')),
  js: filepath => require(filepath),
  json: filepath =>
    JSON.parse(
      require('strip-json-comments')(fs.readFileSync(filepath, 'utf8'))
    )
});

/**
 * Loads and parses, based on file extension, a config file.
 * "JSON" files may have comments.
 * @param {string} filepath - Config file path to load
 * @returns {Object} Parsed config object
 * @private
 */
exports.loadConfig = filepath => {
  let config = {};
  const ext = path.extname(filepath);
  try {
    if (/\.ya?ml/.test(ext)) {
      config = parsers.yaml(filepath);
    } else if (ext === '.js') {
      config = parsers.js(filepath);
    } else {
      config = parsers.json(filepath);
    }
  } catch (err) {
    throw new Error(`failed to parse ${filepath}: ${err}`);
  }
  return config;
};

/**
 * Find ("find up") config file starting at `cwd`
 * @param {string} [cwd] - Current working directory
 * @returns {string|null} Filepath to config, if found
 */
exports.findConfig = (cwd = process.cwd()) => {
  const filepath = findUp(exports.CONFIG_FILES, {cwd});
  if (filepath) {
    debug(`found config at ${filepath}`);
  }
  return filepath;
};
