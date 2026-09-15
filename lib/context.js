import debugModule from "debug";
import packageJson from "../package.json" with { type: "json" };

const debug = debugModule("mocha:context");

/**
 * Defines `globalThis.mocha` so external tooling can statically identify
 * Mocha as the active test runner. Writable/configurable so the browser
 * bundle can overwrite it with the real Mocha instance without throwing.
 * Guarded because sandboxed runtimes (SES/Endo, ShadowRealm) can disallow
 * globalThis mutation, in those environments the marker is simply absent.
 *
 * @example
 * globalThis.mocha; // { name: "mocha", version: "X.Y.Z" }
 */
try {
  Object.defineProperty(globalThis, "mocha", {
    value: {
      name: packageJson.name,
      version: packageJson.version,
    },
    writable: true,
    configurable: true,
  });
} catch (err) {
  debug("unable to define globalThis.mocha", err);
}

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
