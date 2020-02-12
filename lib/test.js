'use strict';
var Runnable = require('./runnable');
var utils = require('./utils');
var errors = require('./errors');
var createInvalidArgumentTypeError = errors.createInvalidArgumentTypeError;
var isString = utils.isString;

module.exports = Test;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @public
 * @class
 * @extends Runnable
 * @param {String} title - Test title (required)
 * @param {Function} [fn] - Test callback.  If omitted, the Test is considered "pending"
 */
function Test(title, fn) {
  if (!isString(title)) {
    throw createInvalidArgumentTypeError(
      'Test argument "title" should be a string. Received type "' +
        typeof title +
        '"',
      'title',
      'string'
    );
  }
  Runnable.call(this, title, fn);
  this.pending = !fn;
  this.type = 'test';
}

/**
 * Inherit from `Runnable.prototype`.
 */
utils.inherits(Test, Runnable);

/**
 * Set or get retried test
 *
 * @private
 */
Test.prototype.retriedTest = function(n) {
  if (!arguments.length) {
    return this._retriedTest;
  }
  this._retriedTest = n;
};

Test.prototype.clone = function() {
  var test = new Test(this.title, this.fn);
  test.timeout(this.timeout());
  test.slow(this.slow());
  test.enableTimeouts(this.enableTimeouts());
  test.retries(this.retries());
  test.currentRetry(this.currentRetry());
  test.retriedTest(this.retriedTest() || this);
  test.globals(this.globals());
  test.parent = this.parent;
  test.file = this.file;
  test.ctx = this.ctx;
  return test;
};
