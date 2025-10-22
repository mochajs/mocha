'use strict';

var Runnable = require('./runnable');
const {constants} = require('./utils');
const {MOCHA_ID_PROP_NAME} = constants;

/**
 * Expose `Hook`.
 */

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`
 *
 * @class
 * @extends Runnable
 */
class Hook extends Runnable {
/**
 * @param {String} title
 * @param {Function} fn
 */
constructor(title, fn) {
  super(title, fn);
  this.type = 'hook';
}

/**
 * Resets the state for a next run.
 */
reset() {
  super.reset();
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
error(err) {
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
serialize() {
  return {
    $$currentRetry: this.currentRetry(),
    $$fullTitle: this.fullTitle(),
    $$isPending: Boolean(this.isPending()),
    $$titlePath: this.titlePath(),
    ctx:
      this.ctx && this.ctx.currentTest
        ? {
            currentTest: {
              title: this.ctx.currentTest.title,
              [MOCHA_ID_PROP_NAME]: this.ctx.currentTest.id
            }
          }
        : {},
    duration: this.duration,
    file: this.file,
    parent: {
      $$fullTitle: this.parent.fullTitle(),
      [MOCHA_ID_PROP_NAME]: this.parent.id
    },
    state: this.state,
    title: this.title,
    type: this.type,
    [MOCHA_ID_PROP_NAME]: this.id
  };
};
}

module.exports = Hook;
