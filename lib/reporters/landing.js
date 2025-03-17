'use strict';
/**
 * @module Landing
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const inherits = require('../utils').inherits;
const constants = require('../runner').constants;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_TEST_END = constants.EVENT_TEST_END;
const STATE_FAILED = require('../runnable').constants.STATE_FAILED;

const cursor = Base.cursor;
const color = Base.color;

/**
 * Expose `Landing`.
 */

exports = module.exports = Landing;

/**
 * Airplane color.
 */

Base.colors.plane = 0;

/**
 * Airplane crash color.
 */

Base.colors['plane crash'] = 31;

/**
 * Runway color.
 */

Base.colors.runway = 90;

/**
 * Constructs a new `Landing` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function Landing (runner, options) {
  Base.call(this, runner, options);

  const self = this;
  const width = (Base.window.width * 0.75) | 0;
  const stream = process.stdout;

  let plane = color('plane', '✈');
  let crashed = -1;
  let n = 0;
  let total = 0;

  function runway () {
    const buf = Array(width).join('-');
    return '  ' + color('runway', buf);
  }

  runner.on(EVENT_RUN_BEGIN, function () {
    stream.write('\n\n\n  ');
    cursor.hide();
  });

  runner.on(EVENT_TEST_END, function (test) {
    // check if the plane crashed
    const col = crashed === -1 ? ((width * ++n) / ++total) | 0 : crashed;
    // show the crash
    if (test.state === STATE_FAILED) {
      plane = color('plane crash', '✈');
      crashed = col;
    }

    // render landing strip
    stream.write('\u001b[' + (width + 1) + 'D\u001b[2A');
    stream.write(runway());
    stream.write('\n  ');
    stream.write(color('runway', Array(col).join('⋅')));
    stream.write(plane);
    stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
    stream.write(runway());
    stream.write('\u001b[0m');
  });

  runner.once(EVENT_RUN_END, function () {
    cursor.show();
    process.stdout.write('\n');
    self.epilogue();
  });

  // if cursor is hidden when we ctrl-C, then it will remain hidden unless...
  process.once('SIGINT', function () {
    cursor.show();
    process.nextTick(function () {
      process.kill(process.pid, 'SIGINT');
    });
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Landing, Base);

Landing.description = 'Unicode landing strip';
