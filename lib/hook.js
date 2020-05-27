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
 * Resets the state for a next run.
 */
Hook.prototype.reset = function() {
  Runnable.prototype.reset.call(this);
  delete this._error;
};

/**
 * Get or set the test `err`.
 *
 * @memberof Hook
 * @public
 * @param {Error} err
 * @return {Error}
 */
Hook.prototype.error = function(err) {
  if (!arguments.length) {
    err = this._error;
    this._error = null;
    return err;
  }

  this._error = err;
};

/**
 * Returns an object suitable for IPC.
 * Functions are represented by keys beginning with `$$`.
 * @private
 * @returns {Object}
 */
Hook.prototype.serialize = function serialize() {
  return {
    $$isPending: this.isPending(),
    $$titlePath: this.titlePath(),
    ctx: {
      currentTest: {
        title: this.ctx && this.ctx.currentTest && this.ctx.currentTest.title
      }
    },
    parent: {
      root: this.parent.root,
      title: this.parent.title
    },
    title: this.title,
    type: this.type
  };
};
