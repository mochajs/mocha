"use strict";

/**
 * @module XUnit
 */

var JUnit = require("./junit");
var { deprecate } = require("../errors");

/**
 * @deprecated Use the `junit` reporter instead. The `xunit` reporter will be
 * repurposed in a future major version to emit actual xUnit XML.
 * See https://github.com/mochajs/mocha/issues/4758
 */
class XUnit extends JUnit {
  static description =
    "JUnit-compatible XML output (deprecated: use 'junit' instead)";

  /**
   * Constructs a new `XUnit` reporter instance.
   *
   * @public
   * @memberof Mocha.reporters
   * @extends Mocha.reporters.JUnit
   * @param {import('../runner.js')} runner - Instance triggers reporter actions.
   * @param {Object} [options] - runner options
   */
  constructor(runner, options) {
    deprecate(
      'The "xunit" reporter is deprecated. Use "junit" instead. ' +
        'The "xunit" reporter will be repurposed in a future major version ' +
        "to emit actual xUnit XML format. " +
        "See https://github.com/mochajs/mocha/issues/4758",
    );
    super(runner, options);
  }
}

exports = module.exports = XUnit;
