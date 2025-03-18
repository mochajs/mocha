'use strict';
/**
 * @module Dot
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;
const constants = require('../runner').constants;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
const EVENT_RUN_END = constants.EVENT_RUN_END;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Constructs a new `Dot` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function Dot(runner, options) {
  Base.call(this, runner, options);

  const self = this;
  const width = (Base.window.width * 0.75) | 0;
  let n = -1;

  runner.on(EVENT_RUN_BEGIN, function () {
    process.stdout.write('\n');
  });

  runner.on(EVENT_TEST_PENDING, function () {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    process.stdout.write(Base.color('pending', Base.symbols.comma));
  });

  runner.on(EVENT_TEST_PASS, function (test) {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    if (test.speed === 'slow') {
      process.stdout.write(Base.color('bright yellow', Base.symbols.dot));
    } else {
      process.stdout.write(Base.color(test.speed, Base.symbols.dot));
    }
  });

  runner.on(EVENT_TEST_FAIL, function () {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    process.stdout.write(Base.color('fail', Base.symbols.bang));
  });

  runner.once(EVENT_RUN_END, function () {
    process.stdout.write('\n');
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Dot, Base);

Dot.description = 'dot matrix representation';
