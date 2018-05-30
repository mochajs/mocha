'use strict';

/**
 * Built-in behaviors.
 * These provide hooks into modifying Mocha's behavior for different use cases.
 */

var utils = require('./utils');

/**
 * Default Mocha behavior
 */
exports.Default = {
  Suite: {
    /**
     * Runs the suite; called by `Suite.create()`.  Calls its callback fn
     * with the Suite as its context.
     * @this {Suite}
     */
    run: function() {
      // FUTURE: async suites
      this.fn.apply(this);
    }
  },
  Runnable: {
    /**
     * Determines whether or not we should provide a nodeback parameter and
     * expect it to be called
     * @this {Runnable}
     * @returns {boolean} `true` if we should run the test fn with a callback
     */
    shouldRunWithCallback: function() {
      return Boolean(this.fn && this.fn.length);
    },
    /**
     * Runs the Runnable synchronously, or potentially returning a Promise
     * @param {Function} done - Callback
     */
    run: function(done) {
      var result = this.fn.call(this.ctx);
      if (result && typeof result.then === 'function') {
        this.resetTimeout();
        result.then(
          function() {
            done();
            // Return null so libraries like bluebird do not warn about
            // subsequently constructed Promises.
            return null;
          },
          function(reason) {
            done(
              reason || new Error('Promise rejected with no or falsy reason')
            );
          }
        );
      } else {
        if (this.asyncOnly) {
          return done(
            new Error(
              '--async-only option in use without declaring `done()` or returning a promise'
            )
          );
        }
        done();
      }
    },
    /**
     * Runs the Runnable, passing a nodeback function, which must be called to
     * complete the test
     * @param {Function} done - Callback
     */
    runWithCallback: function(done) {
      var result = this.fn.call(this.ctx, function(err) {
        if (
          err instanceof Error ||
          Object.prototype.toString.call(err) === '[object Error]'
        ) {
          return done(err);
        }
        if (err) {
          if (Object.prototype.toString.call(err) === '[object Object]') {
            return done(
              new Error('done() invoked with non-Error: ' + JSON.stringify(err))
            );
          }
          return done(new Error('done() invoked with non-Error: ' + err));
        }
        if (result && utils.isPromise(result)) {
          return done(
            new Error(
              'Resolution method is overspecified. Specify a callback *or* return a Promise; not both.'
            )
          );
        }
        done();
      });
    }
  }
};

/**
 * Provides a test context in a functional manner for use with
 * lambdas/arrow functions.
 * All Runnables must either return a promise or call `runnable.done()`, where
 * `runnable` is the first parameter to the Runnable's callback (`fn`)
 */
exports.Functional = {
  Suite: {
    /**
     * Runs the Suite.  Calls its `fn` with NO context and the suite itself
     * as the first parameter.
     * @this {Suite}
     */
    run: function(opts) {
      this.fn.call(null, this);
    }
  },
  Runnable: {
    /**
     * Determines whether or not we should provide a nodeback parameter and
     * expect it to be called; always false
     * @this {Runnable}
     * @returns false
     */
    shouldRunWithCallback: function() {
      return false;
    },

    /**
     * Runs the Runnable expecting a call to ctx.done() or a Promise
     * @param {Function} done - Callback
     */
    run: function(done) {
      this.ctx.done = function(err) {
        if (
          err instanceof Error ||
          Object.prototype.toString.call(err) === '[object Error]'
        ) {
          return done(err);
        }
        if (err) {
          if (Object.prototype.toString.call(err) === '[object Object]') {
            return done(
              new Error('done() invoked with non-Error: ' + JSON.stringify(err))
            );
          }
          return done(new Error('done() invoked with non-Error: ' + err));
        }
        done();
      };
      var result = this.fn.call(null, this.ctx);
      if (result && typeof result.then === 'function') {
        this.resetTimeout();
        result.then(
          function() {
            done();
            // Return null so libraries like bluebird do not warn about
            // subsequently constructed Promises.
            return null;
          },
          function(reason) {
            done(
              reason || new Error('Promise rejected with no or falsy reason')
            );
          }
        );
      }
    }
  }
};
