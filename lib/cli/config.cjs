"use strict";

/**
 * Responsible for loading / finding Mocha's "rc" files.
 *
 * @private
 * @module
 */

const fs = require("node:fs");
const path = require("node:path");
const debug = require("debug")("mocha:cli:config");
const { findUpSync } = require("find-up-simple");
const { createUnparsableFileError } = require("../errors.js");
const utils = require("../utils.cjs");

/**
 * find-up-simple accepts one filename and walks to the filesystem root.
 * find-up's multi-name search checks every name in a directory before
 * moving up, so a local config of any accepted name wins over a
 * higher-priority filename in a parent directory.
 * @param {string[]} files Config filenames, highest precedence first.
 * @param {object} [options]
 * @param {string} [options.cwd] Directory to start from.
 * @returns {string|undefined} Absolute path of the first match.
 */
const findUpSyncAny = (files, options = {}) => {
  const searchDirectory = (directory) => {
    for (const file of files) {
      // stopAt keeps this call inside one directory.
      const filepath = findUpSync(file, { cwd: directory, stopAt: directory });
      if (filepath) {
        return filepath;
      }
    }
    return undefined;
  };

  let directory = path.resolve(options.cwd ?? process.cwd());
  const { root } = path.parse(directory);

  while (directory !== root) {
    const filepath = searchDirectory(directory);
    if (filepath) {
      return filepath;
    }
    directory = path.dirname(directory);
  }

  return searchDirectory(directory);
};

/**
 * These are the valid config files, in order of precedence within one
 * directory. A config in the working directory wins over any config in a
 * parent directory. If `.mocharc.js` is present, then `.mocharc.yaml` and
 * the rest in that same directory are ignored.
 * The user should still be able to explicitly specify a file.
 * @private
 */
// This is documented publicly in `configuring.mdx`
exports.CONFIG_FILES = [
  ".mocharc.cjs",
  ".mocharc.js",
  ".mocharc.mjs",
  ".mocharc.yaml",
  ".mocharc.yml",
  ".mocharc.jsonc",
  ".mocharc.json",
];

/**
 * Parsers for various config filetypes. Each accepts a filepath and
 * returns an object (but could throw)
 */
const parsers = (exports.parsers = {
  yaml: (filepath) =>
    require("js-yaml").load(fs.readFileSync(filepath, "utf8")),
  js: (filepath) => {
    let cwdFilepath;
    try {
      debug('parsers: load cwd-relative path: "%s"', path.resolve(filepath));
      cwdFilepath = require.resolve(path.resolve(filepath)); // evtl. throws
      return require(cwdFilepath);
    } catch (err) {
      if (cwdFilepath) throw err;

      debug('parsers: retry load as module-relative path: "%s"', filepath);
      return require(filepath);
    }
  },
  json: (filepath) =>
    JSON.parse(
      require("strip-json-comments").default(fs.readFileSync(filepath, "utf8")),
    ),
});

/**
 * Loads and parses, based on file extension, a config file.
 * "JSON" files may have comments.
 *
 * @private
 * @param {string} filepath - Config file path to load
 * @returns {Object} Parsed config object
 */
exports.loadConfig = (filepath) => {
  let config;
  debug("loadConfig: trying to parse config at %s", filepath);

  const ext = path.extname(filepath);
  try {
    if (ext === ".yml" || ext === ".yaml") {
      config = parsers.yaml(filepath);
    } else if (ext === ".js" || ext === ".cjs" || ext === ".mjs") {
      const parsedConfig = parsers.js(filepath);
      config = parsedConfig.default ?? parsedConfig;
    } else {
      config = parsers.json(filepath);
    }
  } catch (err) {
    throw createUnparsableFileError(
      `Unable to read/parse ${filepath}: ${err}`,
      filepath,
    );
  }
  return config;
};

/**
 * Find ("find up") config file starting at `cwd`
 *
 * @param {string} [cwd] - Current working directory
 * @returns {string|null} Filepath to config, if found
 */
exports.findConfig = (cwd = utils.cwd()) => {
  const filepath = findUpSyncAny(exports.CONFIG_FILES, { cwd });
  if (filepath) {
    debug("findConfig: found config file %s", filepath);
  }
  return filepath;
};
