'use strict';
var Runnable = require('./runnable');
var utils = require('./utils');
var MochaError = require('./error');
var isString = utils.isString;

module.exports = Test;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @class
 * @extends Runnable
 * @param {String} title
 * @param {Function} fn
 */
function Test(title, fn) {
  if (!isString(title)) {
    throw new MochaError(
      'Test `title` should be a "string" but "' +
        typeof title +
        '" was given instead.',
      'ERR_TITLE_NOT_STRING'
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

Test.prototype.clone = function() {
  var test = new Test(this.title, this.fn);
  test.timeout(this.timeout());
  test.slow(this.slow());
  test.enableTimeouts(this.enableTimeouts());
  test.retries(this.retries());
  test.currentRetry(this.currentRetry());
  test.globals(this.globals());
  test.parent = this.parent;
  test.file = this.file;
  test.ctx = this.ctx;
  return test;
};
