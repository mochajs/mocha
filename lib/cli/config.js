/**
 * Responsible for loading / finding Mocha's "rc" files.
 *
 * @private
 * @module
 */

import fs from "node:fs";
import path from "node:path";
import dbg from "debug";
import findUp from "find-up";
import jsYaml from 'js-yaml';
import { createUnparsableFileError } from "../errors.js";
import * as utils from "../utils.js";

const debug = dbg("mocha:cli:config");

/**
 * These are the valid config files, in order of precedence;
 * e.g., if `.mocharc.js` is present, then `.mocharc.yaml` and the rest
 * will be ignored.
 * The user should still be able to explicitly specify a file.
 * @private
 */
export const CONFIG_FILES = [
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
export const parsers = {
  yaml: (filepath) =>
    jsYaml.load(fs.readFileSync(filepath, "utf8")),
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
}

/**
 * Loads and parses, based on file extension, a config file.
 * "JSON" files may have comments.
 *
 * @private
 * @param {string} filepath - Config file path to load
 * @returns {Object} Parsed config object
 */
export const loadConfig = (filepath) => {
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
export const findConfig = (cwd = utils.cwd()) => {
  const filepath = findUp.sync(CONFIG_FILES, { cwd });
  if (filepath) {
    debug("findConfig: found config file %s", filepath);
  }
  return filepath;
};
