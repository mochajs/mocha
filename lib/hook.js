'use strict';

var Runnable = require('./runnable');
var inherits = require('./utils').inherits;

/**
 * Expose `Hook`.
 */

module.exports = Hook;

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`
 *
 * @class
 * @extends Runnable
 * @param {String} title
 * @param {Function} fn
 */
function Hook(title, fn) {
  Runnable.call(this, title, fn);
  this.type = 'hook';
}

/**
 * Inherit from `Runnable.prototype`.
 */
inherits(Hook, Runnable);

/**
 * Get the test error.
 *
 * @memberof Hook
 * @public
 * @return {Error}
 */
Hook.prototype.getError = function() {
  var err = this._error;
  this._error = null;
  return err;
};
