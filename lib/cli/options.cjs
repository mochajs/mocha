"use strict";

/**
 * Main entry point for handling filesystem-based configuration,
 * whether that's a config file or `package.json` or whatever.
 * @module lib/cli/options
 * @private
 */

const { readFileSync } = require("node:fs");
const pc = require("picocolors");
const { parseMochaArgs } = require("./parse-args.js");
const { ONE_AND_DONE_ARGS } = require("./one-and-dones.js");
const mocharc = require("../mocharc.json");
const { loadConfig, findConfig } = require("./config.cjs");
const { sync } = require("find-up");
const debugModule = require("debug");
const { createUnparsableFileError, isMochaError } = require("../errors.js");

const debug = debugModule("mocha:cli:options");

/**
 * The `parseArgs` function
 * @external parseArgs
 * @see {@link https://nodejs.org/api/util.html#utilparseargsconfig}
 */

/**
 * An object representing arguments parsed from the CLI
 * @memberof external:parseArgs
 * @interface Arguments
 */

/**
 * Base yargs parser configuration
 * @private
 */
const YARGS_PARSER_CONFIG = {
  "combine-arrays": true,
  "short-option-groups": false,
  "dot-notation": false,
  "strip-aliased": true,
};

/**
 * Wrapper around `parseArgs` which applies our settings
 * @param {string|string[]} args - Arguments to parse
 * @param {Object} defaultValues - Default values of mocharc.json
 * @param  {...Object} configObjects - Objects to merge into parsed arguments
 * @private
 * @ignore
 */
const parse = (args = [], defaultValues = {}, ...configObjects) => {
  try {
    return parseMochaArgs(args, defaultValues, ...configObjects);
  } catch (err) {
    if (isMochaError(err)) {
      throw err;
    }
    console.error(pc.red(`Error: ${err.message}`));
    process.exit(1);
  }
};

/**
 * Given path to config file in `args.config`, attempt to load & parse config file.
 * @param {Object} [args] - Arguments object
 * @param {string|boolean} [args.config] - Path to config file or `false` to skip
 * @public
 * @alias module:lib/cli.loadRc
 * @returns {external:yargsParser.Arguments|void} Parsed config, or nothing if `args.config` is `false`
 */
const loadRc = (args = {}) => {
  if (args.config !== false) {
    const config = args.config || findConfig();
    return config ? loadConfig(config) : {};
  }
};

/**
 * Given path to `package.json` in `args.package`, attempt to load config from `mocha` prop.
 * If `args.package` is falsy, attempts to load from default package location (`./package.json`)
 * @param {Object} [args] - Arguments object
 * @param {string|boolean} [args.config] - Path to `package.json` or `false` to use default
 * @public
 * @alias module:lib/cli.loadPkgRc
 * @returns {external:yargsParser.Arguments|void} Parsed config. Throws if unparsableF. Empty object if file not found.
 */
const loadPkgRc = (args = {}) => {
  let result;
  if (args.package === false) {
    return result;
  }
  result = {};
  const filepath = args.package || sync(mocharc.package);
  if (filepath) {
    let configData;
    try {
      configData = readFileSync(filepath, "utf8");
    } catch (err) {
      // If `args.package` was explicitly specified, throw an error
      if (filepath == args.package) {
        throw createUnparsableFileError(
          `Unable to read ${filepath}: ${err}`,
          filepath,
        );
      } else {
        debug("failed to read default package.json at %s; ignoring", filepath);
        return result;
      }
    }
    try {
      const pkg = JSON.parse(configData);
      if (pkg.mocha) {
        debug("`mocha` prop of package.json parsed: %O", pkg.mocha);
        result = pkg.mocha;
      } else {
        debug("no config found in %s", filepath);
      }
    } catch (err) {
      // If JSON failed to parse, throw an error.
      throw createUnparsableFileError(
        `Unable to parse ${filepath}: ${err}`,
        filepath,
      );
    }
  }
  return result;
};

/**
 * Priority list:
 *
 * 1. Command-line args
 * 2. `MOCHA_OPTIONS` environment variable.
 * 3. RC file (`.mocharc.c?js`, `.mocharc.ya?ml`, `mocharc.json`)
 * 4. `mocha` prop of `package.json`
 * 5. default configuration (`lib/mocharc.json`)
 *
 * If a {@link module:lib/cli/one-and-dones.ONE_AND_DONE_ARGS "one-and-done" option} is present in the `argv` array, no external config files will be read.
 * @summary Parses options read from `.mocharc.*` and `package.json`.
 * @param {string|string[]} [argv] - Arguments to parse
 * @public
 * @alias module:lib/cli.loadOptions
 * @returns {external:yargsParser.Arguments} Parsed args from everything
 */
const loadOptions = (argv = []) => {
  let args = parse(argv);
  // short-circuit: look for a flag that would abort loading of options
  if (
    Array.from(ONE_AND_DONE_ARGS).reduce(
      (acc, arg) => acc || arg in args,
      false,
    )
  ) {
    return args;
  }

  const envConfig = parse(process.env.MOCHA_OPTIONS || "");
  const rcConfig = loadRc(args);
  const pkgConfig = loadPkgRc(args);

  if (rcConfig) {
    args.config = false;
    args._ = args._.concat(rcConfig._ || []);
  }
  if (pkgConfig) {
    args.package = false;
    args._ = args._.concat(pkgConfig._ || []);
  }

  args = parse(
    args._,
    mocharc,
    args,
    envConfig,
    rcConfig || {},
    pkgConfig || {},
  );

  // recombine positional arguments and "spec"
  if (args.spec) {
    args._ = args._.concat(args.spec);
    delete args.spec;
  }

  // make unique
  args._ = Array.from(new Set(args._));

  return args;
};

exports.YARGS_PARSER_CONFIG = YARGS_PARSER_CONFIG;
exports.loadRc = loadRc;
exports.loadPkgRc = loadPkgRc;
exports.loadOptions = loadOptions;
