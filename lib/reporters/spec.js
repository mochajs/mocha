'use strict';
/**
 * @module Spec
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const constants = require('../runner').constants;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
const EVENT_SUITE_END = constants.EVENT_SUITE_END;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
const inherits = require('../utils').inherits;
const color = Base.color;

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Constructs a new `Spec` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function Spec (runner, options) {
  Base.call(this, runner, options);

  const self = this;
  let indents = 0;
  let n = 0;

  function indent () {
    return Array(indents).join('  ');
  }

  runner.on(EVENT_RUN_BEGIN, function () {
    Base.consoleLog();
  });

  runner.on(EVENT_SUITE_BEGIN, function (suite) {
    ++indents;
    Base.consoleLog(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on(EVENT_SUITE_END, function () {
    --indents;
    if (indents === 1) {
      Base.consoleLog();
    }
  });

  runner.on(EVENT_TEST_PENDING, function (test) {
    const fmt = indent() + color('pending', '  - %s');
    Base.consoleLog(fmt, test.title);
  });

  runner.on(EVENT_TEST_PASS, function (test) {
    let fmt;
    if (test.speed === 'fast') {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s');
      Base.consoleLog(fmt, test.title);
    } else {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s') +
        color(test.speed, ' (%dms)');
      Base.consoleLog(fmt, test.title, test.duration);
    }
  });

  runner.on(EVENT_TEST_FAIL, function (test) {
    Base.consoleLog(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.once(EVENT_RUN_END, self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Spec, Base);

Spec.description = 'hierarchical & verbose [default]';
