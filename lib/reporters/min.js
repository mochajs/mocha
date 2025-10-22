'use strict';

/**
 * @typedef {import('../runner.js')} Runner
 */

/**
 * @module Min
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var constants = require('../runner').constants;
var EVENT_RUN_END = constants.EVENT_RUN_END;
var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;

/**
 * Constructs a new `Min` reporter instance.
 *
 * @description
 * This minimal test reporter is best used with '--watch'.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 */
class Min extends Base {
/**
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
constructor(runner, options) {
  super(runner, options);

  runner.on(EVENT_RUN_BEGIN, function () {
    // clear screen
    process.stdout.write('\u001b[2J');
    // set cursor position
    process.stdout.write('\u001b[1;3H');
  });

  runner.once(EVENT_RUN_END, this.epilogue.bind(this));
}
}

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

Min.description = 'essentially just a summary';
