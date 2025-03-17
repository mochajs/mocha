'use strict';
/**
 * @module XUnit
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const utils = require('../utils');
const fs = require('node:fs');
const path = require('node:path');
const errors = require('../errors');
const createUnsupportedError = errors.createUnsupportedError;
const constants = require('../runner').constants;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
const STATE_FAILED = require('../runnable').constants.STATE_FAILED;
const inherits = utils.inherits;
const escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */
const Date = global.Date;

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
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function XUnit (runner, options) {
  Base.call(this, runner, options);

  const stats = this.stats;
  const tests = [];
  const self = this;

  // the name of the test suite, as it will appear in the resulting XML file
  let suiteName;

  // the default name of the test suite if none is provided
  const DEFAULT_SUITE_NAME = 'Mocha Tests';

  if (options && options.reporterOptions) {
    if (options.reporterOptions.output) {
      if (!fs.createWriteStream) {
        throw createUnsupportedError('file output not supported in browser');
      }

      fs.mkdirSync(path.dirname(options.reporterOptions.output), {
        recursive: true
      });
      self.fileStream = fs.createWriteStream(options.reporterOptions.output);
    }

    // get the suite name from the reporter options (if provided)
    suiteName = options.reporterOptions.suiteName;
  }

  // fall back to the default suite name
  suiteName = suiteName || DEFAULT_SUITE_NAME;

  runner.on(EVENT_TEST_PENDING, function (test) {
    tests.push(test);
  });

  runner.on(EVENT_TEST_PASS, function (test) {
    tests.push(test);
  });

  runner.on(EVENT_TEST_FAIL, function (test) {
    tests.push(test);
  });

  runner.once(EVENT_RUN_END, function () {
    self.write(
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

    tests.forEach(function (t) {
      self.test(t);
    });

    self.write('</testsuite>');
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(XUnit, Base);

/**
 * Override done to close the stream (if it's a file).
 *
 * @param failures
 * @param {Function} fn
 */
XUnit.prototype.done = function (failures, fn) {
  if (this.fileStream) {
    this.fileStream.end(function () {
      fn(failures);
    });
  } else {
    fn(failures);
  }
};

/**
 * Write out the given line.
 *
 * @param {string} line
 */
XUnit.prototype.write = function (line) {
  if (this.fileStream) {
    this.fileStream.write(line + '\n');
  } else if (typeof process === 'object' && process.stdout) {
    process.stdout.write(line + '\n');
  } else {
    Base.consoleLog(line);
  }
};

/**
 * Output tag for the given `test.`
 *
 * @param {Test} test
 */
XUnit.prototype.test = function (test) {
  Base.useColors = false;

  const attrs = {
    classname: test.parent.fullTitle(),
    name: test.title,
    file: test.file,
    time: test.duration / 1000 || 0
  };

  if (test.state === STATE_FAILED) {
    const err = test.err;
    const diff =
      !Base.hideDiff && Base.showDiff(err)
        ? '\n' + Base.generateDiff(err.actual, err.expected)
        : '';
    this.write(
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
    this.write(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    this.write(tag('testcase', attrs, true));
  }
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
function tag (name, attrs, close, content) {
  const end = close ? '/>' : '>';
  const pairs = [];
  let tag;

  for (const key in attrs) {
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
