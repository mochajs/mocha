'use strict';
/**
 * @module Context
 */
/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @private
 */
function Context() {}

/**
 * Set or get the context `Runnable` to `runnable`.
 *
 * @private
 * @param {Runnable} runnable
 * @return {Context} context
 */
Context.prototype.runnable = function (runnable) {
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
Context.prototype.timeout = function (ms) {
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
Context.prototype.slow = function (ms) {
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
Context.prototype.skip = function () {
  this.runnable().skip();
};

/**
 * Set or get a number of allowed retries on failed tests
 *
 * @private
 * @param {number} n
 * @return {Context} self
 */
Context.prototype.retries = function (n) {
  if (!arguments.length) {
    return this.runnable().retries();
  }
  this.runnable().retries(n);
  return this;
};

/**
 * Defines a global read-only property `mochaVar` that provides access to Mocha's name and version.
 * It is accessible globally within the Node.js environment or in the browser
 * @example
 * console.log(globalThis.mochaVar); // Outputs: { name: "mocha", version: "X.Y.Z" }
 *
 * @property {Object} mochaVar - The global property containing Mocha's name and version.
 * @property {string} mochaVar.name - The name of the Mocha package.
 * @property {string} mochaVar.version - The current version of the Mocha package.
 */
var mochaPackageJson = require('../package.json');
var version = mochaPackageJson.version;
var name = mochaPackageJson.name;

Object.defineProperty(globalThis, 'mochaVar', {
  get: () => ({
    name,
    version
  })
});
