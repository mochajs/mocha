'use strict';
/**
 * @module XUnit
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var utils = require('../utils');
var ReportWriter = require('./writers/report');
var constants = require('../runner').constants;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_RUN_END = constants.EVENT_RUN_END;
var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
var STATE_FAILED = require('../runnable').constants.STATE_FAILED;
var inherits = utils.inherits;
var escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */
var Date = global.Date;

/**
 * Expose `XUnit`.
 */
exports = module.exports = XUnit;

/**
 * Constructs a new `XUnit` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @mixes StreamWriter
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function XUnit(runner, options) {
  Base.call(this, runner, options);

  var self = this;
  var stats = this.stats;
  var tests = [];

  // Name of the test suite, as it will appear in the resulting XML file
  var suiteName = XUnit.getSuiteName(this);

  // Write to file, if requested
  ReportWriter.maybeCreateFileOutput(this);

  runner.on(EVENT_TEST_PENDING, function(test) {
    tests.push(test);
  });

  runner.on(EVENT_TEST_PASS, function(test) {
    tests.push(test);
  });

  runner.on(EVENT_TEST_FAIL, function(test) {
    tests.push(test);
  });

  runner.once(EVENT_RUN_END, function() {
    self.writeln(
      tag(
        'testsuite',
        {
          name: suiteName,
          tests: stats.tests,
          failures: 0,
          errors: stats.failures,
          skipped: stats.tests - stats.failures - stats.passes,
          timestamp: new Date().toUTCString(),
          time: stats.duration / 1000 || 0
        },
        false
      )
    );

    tests.forEach(function(t) {
      self.test(t);
    });

    self.writeln('</testsuite>');
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(XUnit, Base);
ReportWriter.call(XUnit.prototype);

/**
 * Output tag for the given `test.`
 *
 * @param {Test} test
 */
XUnit.prototype.test = function(test) {
  Base.useColors = false;

  var attrs = {
    classname: test.parent.fullTitle(),
    name: test.title,
    time: test.duration / 1000 || 0
  };

  if (test.state === STATE_FAILED) {
    var err = test.err;
    var diff =
      Base.hideDiff || !err.actual || !err.expected
        ? ''
        : '\n' + Base.generateDiff(err.actual, err.expected);
    this.writeln(
      tag(
        'testcase',
        attrs,
        false,
        tag(
          'failure',
          {},
          false,
          escape(err.message) + escape(diff) + '\n' + escape(err.stack)
        )
      )
    );
  } else if (test.isPending()) {
    this.writeln(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    this.writeln(tag('testcase', attrs, true));
  }
};

/**
 * Gets the name of the test suite.
 *
 * @static
 * @param {Object} reporter - Instance of XUnit
 * @returns {String} name of test suite
 */
XUnit.getSuiteName = function(reporter) {
  var DEFAULT_SUITE_NAME = 'Mocha Tests';
  var reporterOptions = (reporter.options || {}).reporterOptions || {};

  return reporterOptions.suiteName || DEFAULT_SUITE_NAME;
};

/**
 * HTML tag helper.
 *
 * @param name
 * @param attrs
 * @param close
 * @param content
 * @return {string}
 */
function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>';
  var pairs = [];
  var tag;

  for (var key in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
      pairs.push(key + '="' + escape(attrs[key]) + '"');
    }
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) {
    tag += content + '</' + name + end;
  }
  return tag;
}

XUnit.description = 'XUnit-compatible XML output';
