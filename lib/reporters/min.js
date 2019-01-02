'use strict';
/**
 * @module Min
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

/**
 * Initialize a new `Min` minimal test reporter (best used with --watch).
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner
 */
function Min(runner) {
  Base.call(this, runner);
  runner.once('end', this.epilogue.bind(this));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Min, Base);

Min.description = 'essentially just a summary';
