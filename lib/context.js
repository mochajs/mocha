'use strict';

/**
 * @typedef {import('./runnable.js')} Runnable
 */

/**
 * @module Context
 */

/**
 * Initialize a new `Context`.
 */
class Context {
/**
 * @private
 */
constructor() {}

/**
 * Set or get the context `Runnable` to `runnable`.
 *
 * @private
 * @param {Runnable} runnable
 * @return {Context} context
 */
runnable(runnable) {
  if (!arguments.length) {
    return this._runnable;
  }
  this.test = this._runnable = runnable;
  return this;
};

/**
 * Set or get test timeout `ms`.
 *
 * @private
 * @param {number} ms
 * @return {Context} self
 */
timeout(ms) {
  if (!arguments.length) {
    return this.runnable().timeout();
  }
  this.runnable().timeout(ms);
  return this;
};

/**
 * Set or get test slowness threshold `ms`.
 *
 * @private
 * @param {number} ms
 * @return {Context} self
 */
slow(ms) {
  if (!arguments.length) {
    return this.runnable().slow();
  }
  this.runnable().slow(ms);
  return this;
};

/**
 * Mark a test as skipped.
 *
 * @private
 * @throws Pending
 */
skip() {
  this.runnable().skip();
};

/**
 * Set or get a number of allowed retries on failed tests
 *
 * @private
 * @param {number} n
 * @return {Context} self
 */
retries(n) {
  if (!arguments.length) {
    return this.runnable().retries();
  }
  this.runnable().retries(n);
  return this;
};
}

/**
 * Expose `Context`.
 */

module.exports = Context;
