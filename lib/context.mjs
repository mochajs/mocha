/**
 * @typedef {import('./runnable.js')} Runnable
 */

/**
 * Initialize a new `Context`.
 *
 * @private
 */
class Context {
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
  }
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
  }
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
  }
  /**
   * Set or get test fast threshold `ms`.
   *
   * If not explicitly set, returns half of the slow threshold.
   *
   * @private
   * @param {number} ms
   * @return {Context} self
   */
  fast(ms) {
    if (!arguments.length) {
      return this.runnable().fast();
    }
    this.runnable().fast(ms);
    return this;
  }
  /**
   * Mark a test as skipped.
   *
   * @private
   * @throws PendingError
   */
  skip() {
    this.runnable().skip();
  }
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
  }
}

export { Context };
