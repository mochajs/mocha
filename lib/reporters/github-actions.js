"use strict";

/**
 * @typedef {import('../runner.js')} Runner
 * @typedef {import('../test.js')} Test
 */

/**
 * @module GithubActions
 */
/**
 * Module dependencies.
 */

var fs = require("fs");
var Spec = require("./spec");
var ms = require("ms");
var constants = require("../runner").constants;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_RUN_END = constants.EVENT_RUN_END;

/**
 * Extract file, line, and column from an error stack trace.
 *
 * @private
 * @param {string} [stackTrace] - stack trace string
 * @return {{ file?: string, line?: string, col?: string }}
 */
function extractLocation(stackTrace) {
  if (!stackTrace) {
    return {};
  }
  var matches =
    /^\s*at Context.*\(([^()]+):([0-9]+):([0-9]+)\)/gm.exec(stackTrace) ||
    /^\s*at.*\(([^()]+):([0-9]+):([0-9]+)\)/gm.exec(stackTrace);
  if (matches === null) {
    return {};
  }
  return {
    file: matches[1],
    line: matches[2],
    col: matches[3],
  };
}

/**
 * Escape a value for use in a GitHub Actions workflow command.
 *
 * @private
 * @param {string} value
 * @return {string}
 */
function escapeWorkflowValue(value) {
  return String(value)
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A");
}

/**
 * Escape a property value for use in a GitHub Actions workflow command.
 *
 * @private
 * @param {string} value
 * @return {string}
 */
function escapeWorkflowProperty(value) {
  return String(value)
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A")
    .replace(/:/g, "%3A")
    .replace(/,/g, "%2C");
}

class GithubActions extends Spec {
  static description =
    "like spec, with GitHub Actions error annotations and job summary";

  /**
   * Constructs a new `GithubActions` reporter instance.
   *
   * @description
   * Extends the Spec reporter to add GitHub Actions error annotations
   * and Job Summary output when running in GitHub Actions CI.
   *
   * @public
   * @memberof Mocha.reporters
   * @extends Mocha.reporters.Spec
   * @param {Runner} runner - Instance triggers reporter actions.
   * @param {Object} [options] - runner options
   */
  constructor(runner, options) {
    super(runner, options);

    var ciFailures = [];

    runner.on(EVENT_TEST_FAIL, function (test) {
      ciFailures.push(test);
    });

    runner.once(EVENT_RUN_END, () => {
      if (ciFailures.length > 0) {
        process.stdout.write("::group::Mocha Annotations\n");

        for (var test of ciFailures) {
          var location = extractLocation(test.err && test.err.stack);
          var props = [];
          if (location.file) {
            props.push("file=" + escapeWorkflowProperty(location.file));
          }
          if (location.line) {
            props.push("line=" + escapeWorkflowProperty(location.line));
          }
          if (location.col) {
            props.push("col=" + escapeWorkflowProperty(location.col));
          }

          var message = test.err ? escapeWorkflowValue(test.err.message) : "";
          process.stdout.write(
            "::error " + props.join(",") + "::" + message + "\n",
          );
        }

        process.stdout.write("::endgroup::\n");
      }

      // Write GitHub Job Summary if supported
      var summaryFile = process.env.GITHUB_STEP_SUMMARY;
      if (summaryFile) {
        var lines = [];
        lines.push(
          ":white_check_mark: " +
            (this.stats.passes || 0) +
            " passing (" +
            ms(this.stats.duration) +
            ")",
        );
        if (this.stats.pending) {
          lines.push(":pause_button: " + this.stats.pending + " pending");
        }
        if (this.stats.failures) {
          lines.push(":x: " + this.stats.failures + " failing");
        }
        try {
          fs.appendFileSync(summaryFile, lines.join("\n") + "\n");
        } catch {
          // Silently ignore summary write failures
        }
      }
    });
  }
}

exports = module.exports = GithubActions;
