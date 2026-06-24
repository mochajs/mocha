"use strict";

/**
 * Track which {@link Runnable} "owns" the async context that
 * code is currently running in.
 * Let the {@link Runner} attribute an asynchronous uncaught
 * exception to the test OR hook that scheduled the failing async operation
 * instead of blaming whichever Runnable happens to be running when the error
 * appear.
 *
 * Backed by AsyncLocalStorage so the owner propagates automatically
 * through process.nextTick timers and promise chains.
 *
 * Also, Module is Node only, it is stubbed out in browser builds via the
 * browser field in package.json so callers must treat a missing export as
 * "no attribution available" and fall back to their previous behavior.
 * @private
 */

const { AsyncLocalStorage } = require("node:async_hooks");

/**
 * Create an isolated owner tracker. Each {@link Runner} gets its own so that a
 * Runner only ever attributes errors to Runnables it actually ran (relevant
 * when Mocha run its own test suite).
 *
 * @private
 * @returns {{run: Function, getOwner: Function}}
 */
exports.createRunnableContext = function createRunnableContext() {
  const storage = new AsyncLocalStorage();
  return {
    /**
     * Run fn with runnable registered as the owner of the current async context.
     * @param {Runnable} runnable
     * @param {Function} fn
     * @returns {*} whatever fn returns
     */
    run(runnable, fn) {
      return storage.run(runnable, fn);
    },
    /**
     * @returns {Runnable|undefined} the Runnable that owns the current async
     * context or undefined when running outside of any tracked Runnable.
     */
    getOwner() {
      return storage.getStore();
    },
  };
};
