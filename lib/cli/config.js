'use strict';

/**
 * Responsible for loading / finding Mocha's "rc" files.
 * This doesn't have anything to do with `mocha.opts`.
 *
 * @private
 * @module
 */

const fs = require('fs');
const findUp = require('find-up');
const path = require('path');
const debug = require('debug')('mocha:cli:config');
const utils = require('../utils');

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
  '.mocharc.jsonc',
  '.mocharc.json'
];

/**
 * Parsers for various config filetypes.  Each accepts a filepath and
 * returns an object (but could throw)
 *
 * Filepath *must* be absolute; external logic resolves relative paths.
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
 * @param {string} filepath - Config file path or module name to load
 * @returns {Object} Parsed config object
 * @private
 */
exports.loadConfig = filepath => {
  const {absFilepath, discoveryMethod} = exports.resolveConfigPath(filepath);
  return exports.parseConfig(absFilepath, discoveryMethod);
};

/**
 * Resolve the location of a config on disk and the method of discovery:
 * cwd-relative path or require.resolve
 *
 * As opposed to findConfig, this does not ascend the filesystem.
 * When the user specifies `--config`, findConfig is not called, but
 * `resolveConfigPath` is still called.
 *
 * @param {string} filepath - Config file path or module name to load
 * @private
 */
exports.resolveConfigPath = filepath => {
  /** @type {'cwd-relative' | 'node-require-resolve'} */
  let discoveryMethod = 'cwd-relative';
  let absFilepath = path.resolve(filepath);
  if (!fs.existsSync(absFilepath) || fs.statSync(absFilepath).isDirectory()) {
    discoveryMethod = 'node-require-resolve';
    try {
      absFilepath = utils.requireResolveRelative(filepath);
    } catch (e) {
      throw new Error(
        `failed to locate ${filepath} as either a relative path or a require()-able node module`
      );
    }
  }
  return {discoveryMethod, absFilepath};
};

/**
 * @param {string} absFilepath absolute path to config file
 * @param {'cwd-relative' | 'node-require-resolve'} discoveryMethod
 */
exports.parseConfig = (absFilepath, discoveryMethod) => {
  let config = {};
  const ext = path.extname(absFilepath);
  try {
    if (discoveryMethod === 'node-require-resolve') {
      config = require(absFilepath);
    } else if (/\.ya?ml/.test(ext)) {
      config = parsers.yaml(absFilepath);
    } else if (ext === '.js') {
      config = parsers.js(absFilepath);
    } else {
      config = parsers.json(absFilepath);
    }
  } catch (err) {
    throw new Error(
      `failed to parse ${path.relative(process.cwd(), absFilepath)}: ${err}`
    );
  }
  return config;
};

/**
 * Find ("find up") config file starting at `cwd`
 * @param {string} [cwd] - Current working directory
 * @returns {string|null} Filepath to config, if found
 */
exports.findConfig = (cwd = process.cwd()) => {
  const filepath = findUp.sync(exports.CONFIG_FILES, {cwd});
  if (filepath) {
    debug(`found config at ${filepath}`);
  }
  return filepath;
};
