'use strict';
/**
 * @module Progress
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const constants = require('../runner').constants;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_TEST_END = constants.EVENT_TEST_END;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const inherits = require('../utils').inherits;
const color = Base.color;
const cursor = Base.cursor;

/**
 * Expose `Progress`.
 */

exports = module.exports = Progress;

/**
 * General progress bar color.
 */

Base.colors.progress = 90;

/**
 * Constructs a new `Progress` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function Progress (runner, options) {
  Base.call(this, runner, options);

  const self = this;
  const width = (Base.window.width * 0.5) | 0;
  const total = runner.total;
  let complete = 0;
  let lastN = -1;

  // default chars
  options = options || {};
  const reporterOptions = options.reporterOptions || {};

  options.open = reporterOptions.open || '[';
  options.complete = reporterOptions.complete || '▬';
  options.incomplete = reporterOptions.incomplete || Base.symbols.dot;
  options.close = reporterOptions.close || ']';
  options.verbose = reporterOptions.verbose || false;

  // tests started
  runner.on(EVENT_RUN_BEGIN, function () {
    process.stdout.write('\n');
    cursor.hide();
  });

  // tests complete
  runner.on(EVENT_TEST_END, function () {
    complete++;

    const percent = complete / total;
    const n = (width * percent) | 0;
    const i = width - n;

    if (n === lastN && !options.verbose) {
      // Don't re-render the line if it hasn't changed
      return;
    }
    lastN = n;

    cursor.CR();
    process.stdout.write('\u001b[J');
    process.stdout.write(color('progress', '  ' + options.open));
    process.stdout.write(Array(n).join(options.complete));
    process.stdout.write(Array(i).join(options.incomplete));
    process.stdout.write(color('progress', options.close));
    if (options.verbose) {
      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
    }
  });

  // tests are complete, output some stats
  // and the failures if any
  runner.once(EVENT_RUN_END, function () {
    cursor.show();
    process.stdout.write('\n');
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Progress, Base);

Progress.description = 'a progress bar';
