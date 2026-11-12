/**
 * @typedef {import('../runner.js').Runner} Runner
 */

/**
 * @module JSON
 */
/**
 * Module dependencies.
 */

import { Base } from "./base.js";
import fs from "node:fs";
import path from "node:path";
import * as errors from "../errors.js";
import utils from "../utils.cjs";
import { Runner } from "../runner.js";
const createUnsupportedError = errors.createUnsupportedError;
const createInvalidArgumentValueError = errors.createInvalidArgumentValueError;
var constants = Runner.constants;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_TEST_END = constants.EVENT_TEST_END;
var EVENT_RUN_END = constants.EVENT_RUN_END;

const DEFAULT_INDENT = 2;

/**
 * Validates the `indent` reporter option, which may be a number or a numeric
 * string (as it is when given via `--reporter-option indent=4`).
 *
 * @private
 * @param {number|string} value
 * @return {number} Number of spaces to indent by; `0` disables formatting
 */
function parseIndent(value) {
  const indent =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (!Number.isInteger(indent) || indent < 0) {
    throw createInvalidArgumentValueError(
      `Invalid "indent" reporter option: ${JSON.stringify(value)}`,
      "reporterOption.indent",
      value,
      "expected a non-negative integer",
    );
  }
  return indent;
}

class JSONReporter extends Base {
  static description = "single JSON object";

  /**
   * Constructs a new `JSON` reporter instance.
   *
   * @public
   * @memberof Mocha.reporters
   * @extends Mocha.reporters.Base
   * @param {Runner} runner - Instance triggers reporter actions.
   * @param {Object} [options] - runner options
   */
  constructor(runner, options = {}) {
    super(runner, options);

    var self = this;
    var tests = [];
    var pending = [];
    var failures = [];
    var passes = [];
    var output;
    var indent = DEFAULT_INDENT;

    if (options.reporterOption && options.reporterOption.output) {
      if (utils.isBrowser()) {
        throw createUnsupportedError("file output not supported in browser");
      }
      output = options.reporterOption.output;
    }

    if (options.reporterOption && options.reporterOption.indent !== undefined) {
      indent = parseIndent(options.reporterOption.indent);
    }

    runner.on(EVENT_TEST_END, function (test) {
      tests.push(test);
    });

    runner.on(EVENT_TEST_PASS, function (test) {
      passes.push(test);
    });

    runner.on(EVENT_TEST_FAIL, function (test) {
      failures.push(test);
    });

    runner.on(EVENT_TEST_PENDING, function (test) {
      pending.push(test);
    });

    runner.once(EVENT_RUN_END, function () {
      var obj = {
        stats: self.stats,
        tests: tests.map(clean),
        pending: pending.map(clean),
        failures: failures.map(clean),
        passes: passes.map(clean),
      };

      runner.testResults = obj;

      var json = JSON.stringify(obj, null, indent);
      if (output) {
        try {
          fs.mkdirSync(path.dirname(output), { recursive: true });
          fs.writeFileSync(output, json);
        } catch (err) {
          console.error(
            `${Base.symbols.err} [mocha] writing output to "${output}" failed: ${err.message}\n`,
          );
          process.stdout.write(json);
        }
      } else {
        process.stdout.write(json);
      }
    });
  }
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @private
 * @param {Object} test
 * @return {Object}
 */
function clean(test) {
  var err = test.err || {};
  if (err instanceof Error) {
    err = errorJSON(err);
  }

  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    file: test.file,
    duration: test.duration,
    currentRetry: test.currentRetry(),
    speed: test.speed,
    err: cleanCycles(err),
  };
}

/**
 * Replaces any circular references inside `obj` with '[object Object]'
 *
 * @private
 * @param {Object} obj
 * @return {Object}
 */
function cleanCycles(obj) {
  var cache = [];
  return JSON.parse(
    JSON.stringify(obj, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Instead of going in a circle, we'll print [object Object]
          return "" + value;
        }
        cache.push(value);
      }

      return value;
    }),
  );
}

/**
 * Transform an Error object into a JSON object.
 *
 * @private
 * @param {Error} err
 * @return {Object}
 */
function errorJSON(err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    res[key] = err[key];
  }, err);
  return res;
}

export { JSONReporter };
