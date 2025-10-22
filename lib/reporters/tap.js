'use strict';

/**
 * @typedef {import('../runner.js')} Runner
 * @typedef {import('../test.js')} Test
 */

/**
 * @module TAP
 */
/**
 * Module dependencies.
 */

var util = require('node:util');
var Base = require('./base');
var constants = require('../runner').constants;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
var EVENT_RUN_END = constants.EVENT_RUN_END;
var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
var EVENT_TEST_END = constants.EVENT_TEST_END;
var sprintf = util.format;

/**
 * Constructs a new `TAP` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 */
class TAP extends Base {
/**
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
constructor(runner, options) {
  super(runner, options);

  var self = this;
  var n = 1;

  var tapVersion = '12';
  if (options && options.reporterOptions) {
    if (options.reporterOptions.tapVersion) {
      tapVersion = options.reporterOptions.tapVersion.toString();
    }
  }

  this._producer = createProducer(tapVersion);

  runner.once(EVENT_RUN_BEGIN, function () {
    self._producer.writeVersion();
  });

  runner.on(EVENT_TEST_END, function () {
    ++n;
  });

  runner.on(EVENT_TEST_PENDING, function (test) {
    self._producer.writePending(n, test);
  });

  runner.on(EVENT_TEST_PASS, function (test) {
    self._producer.writePass(n, test);
  });

  runner.on(EVENT_TEST_FAIL, function (test, err) {
    self._producer.writeFail(n, test, err);
  });

  runner.once(EVENT_RUN_END, function () {
    self._producer.writeEpilogue(runner.stats);
  });
}
}

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Returns a TAP-safe title of `test`.
 *
 * @private
 * @param {Test} test - Test instance.
 * @return {String} title with any hash character removed
 */
function title(test) {
  return test.fullTitle().replace(/#/g, '');
}

/**
 * Writes newline-terminated formatted string to reporter output stream.
 *
 * @private
 * @param {string} format - `printf`-like format string
 * @param {...*} [varArgs] - Format string arguments
 */
function println() {
  var vargs = Array.from(arguments);
  vargs[0] += '\n';
  process.stdout.write(sprintf.apply(null, vargs));
}

/**
 * Returns a `tapVersion`-appropriate TAP producer instance, if possible.
 *
 * @private
 * @param {string} tapVersion - Version of TAP specification to produce.
 * @returns {TAPProducer} specification-appropriate instance
 * @throws {Error} if specification version has no associated producer.
 */
function createProducer(tapVersion) {
  var producers = {
    12: new TAP12Producer(),
    13: new TAP13Producer()
  };
  var producer = producers[tapVersion];

  if (!producer) {
    throw new Error(
      'invalid or unsupported TAP version: ' + JSON.stringify(tapVersion)
    );
  }

  return producer;
}

/**
 * @summary
 * Constructs a new TAPProducer.
 *
 * @description
 * <em>Only</em> to be used as an abstract base class.
 *
 * @private
 * @constructor
 */
class TAPProducer {

/**
 * Writes the TAP version to reporter output stream.
 *
 * @abstract
 */
writeVersion() {};

/**
 * Writes the plan to reporter output stream.
 *
 * @param {number} ntests - Number of tests that are planned to run.
 */
writePlan(ntests) {
  println('%d..%d', 1, ntests);
};

/**
 * Writes that test passed to reporter output stream.
 *
 * @abstract
 * @param {number} n - Index of test that passed.
 * @param {Test} test - Instance containing test information.
 */
writePass(n, test) {
  println('ok %d %s', n, title(test));
};

/**
 * Writes that test was skipped to reporter output stream.
 *
 * @abstract
 * @param {number} n - Index of test that was skipped.
 * @param {Test} test - Instance containing test information.
 */
writePending(n, test) {
  println('ok %d %s # SKIP -', n, title(test));
};

/**
 * Writes that test failed to reporter output stream.
 *
 * @abstract
 * @param {number} n - Index of test that failed.
 * @param {Test} test - Instance containing test information.
 */
writeFail(n, test) {
  println('not ok %d %s', n, title(test));
};

/**
 * Writes the summary epilogue to reporter output stream.
 *
 * @param {Object} stats - Object containing run statistics.
 */
writeEpilogue(stats) {
  // :TBD: Why is this not counting pending tests?
  println('# tests ' + (stats.passes + stats.failures));
  println('# pass ' + stats.passes);
  // :TBD: Why are we not showing pending results?
  println('# fail ' + stats.failures);
  this.writePlan(stats.passes + stats.failures + stats.pending);
};
}

/**
 * @summary
 * Constructs a new TAP12Producer.
 *
 * @description
 * Produces output conforming to the TAP12 specification.
 *
 * @private
 * @constructor
 * @extends TAPProducer
 * @see {@link https://testanything.org/tap-specification.html|Specification}
 */
class TAP12Producer extends TAPProducer {
constructor() {
  super();
  /**
   * Writes that test failed to reporter output stream, with error formatting.
   * @override
   */
  this.writeFail = function (n, test, err) {
    TAPProducer.prototype.writeFail.call(this, n, test, err);
    if (err.message) {
      println(err.message.replace(/^/gm, '  '));
    }
    if (err.stack) {
      println(err.stack.replace(/^/gm, '  '));
    }
  };
}
}

/**
 * @summary
 * Constructs a new TAP13Producer.
 *
 * @description
 * Produces output conforming to the TAP13 specification.
 *
 * @private
 * @constructor
 * @extends TAPProducer
 * @see {@link https://testanything.org/tap-version-13-specification.html|Specification}
 */
class TAP13Producer extends TAPProducer {
constructor() {
  super();
  /**
   * Writes the TAP version to reporter output stream.
   * @override
   */
  this.writeVersion = function () {
    println('TAP version 13');
  };

  /**
   * Writes that test failed to reporter output stream, with error formatting.
   * @override
   */
  this.writeFail = function (n, test, err) {
    TAPProducer.prototype.writeFail.call(this, n, test, err);
    var emitYamlBlock = err.message != null || err.stack != null;
    if (emitYamlBlock) {
      println(indent(1) + '---');
      if (err.message) {
        println(indent(2) + 'message: |-');
        println(err.message.replace(/^/gm, indent(3)));
      }
      if (err.stack) {
        println(indent(2) + 'stack: |-');
        println(err.stack.replace(/^/gm, indent(3)));
      }
      println(indent(1) + '...');
    }
  };

  function indent(level) {
    return Array(level + 1).join('  ');
  }
}
}

TAP.description = 'TAP-compatible output';
