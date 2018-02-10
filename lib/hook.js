'use strict';

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');
var inherits = require('./utils').inherits;

/**
 * Expose `Hook`.
 */

module.exports = Hook;

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`.
 *
 * @class Hook
 * @extends Runnable
 * @memberof Mocha 
 * @param {String} title
 * @param {Function} fn
 * @api private
 */
function Hook (title, fn) {
  Runnable.call(this, title, fn);
  this.type = 'hook';
}

/**
 * Inherit from `Runnable.prototype`.
 */
inherits(Hook, Runnable);

/**
 * Get or set the test `err`.
 *
 * @param {Error} err
 * @return {Error}
 * @public
 * @memberof Mocha.Hook
 * @api public
 */
Hook.prototype.error = function (err) {
  if (!arguments.length) {
    err = this._error;
    this._error = null;
    return err;
  }

  this._error = err;
};
