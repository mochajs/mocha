'use strict';
var Runnable = require('./runnable');
var utils = require('./utils');
var errors = require('./errors');
var createInvalidArgumentTypeError = errors.createInvalidArgumentTypeError;
var isString = utils.isString;

const {MOCHA_ID_PROP_NAME} = utils.constants;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @public
 * @class
 * @extends Runnable
 */
class Test extends Runnable {
/**
 * @param {String} title - Test title (required)
 * @param {Function} [fn] - Test callback.  If omitted, the Test is considered "pending"
 */
constructor(title, fn) {
  if (!isString(title)) {
    throw createInvalidArgumentTypeError(
      'Test argument "title" should be a string. Received type "' +
        typeof title +
        '"',
      'title',
      'string'
    );
  }
  super(title, fn);
  this.type = 'test';
  this.reset();
}

/**
 * Resets the state initially or for a next run.
 */
reset() {
  super.reset();
  this.pending = !this.fn;
  delete this.state;
};

/**
 * Set or get retried test
 *
 * @private
 */
retriedTest(n) {
  if (!arguments.length) {
    return this._retriedTest;
  }
  this._retriedTest = n;
};

/**
 * Add test to the list of tests marked `only`.
 *
 * @private
 */
markOnly() {
  this.parent.appendOnlyTest(this);
};

clone() {
  var test = new Test(this.title, this.fn);
  test.timeout(this.timeout());
  test.slow(this.slow());
  test.retries(this.retries());
  test.currentRetry(this.currentRetry());
  test.retriedTest(this.retriedTest() || this);
  test.globals(this.globals());
  test.parent = this.parent;
  test.file = this.file;
  test.ctx = this.ctx;
  return test;
};

/**
 * Returns an minimal object suitable for transmission over IPC.
 * Functions are represented by keys beginning with `$$`.
 * @private
 * @returns {Object}
 */
serialize() {
  return {
    $$currentRetry: this._currentRetry,
    $$fullTitle: this.fullTitle(),
    $$isPending: Boolean(this.pending),
    $$retriedTest: this._retriedTest || null,
    $$slow: this._slow,
    $$titlePath: this.titlePath(),
    body: this.body,
    duration: this.duration,
    err: this.err,
    parent: {
      $$fullTitle: this.parent.fullTitle(),
      [MOCHA_ID_PROP_NAME]: this.parent.id
    },
    speed: this.speed,
    state: this.state,
    title: this.title,
    type: this.type,
    file: this.file,
    [MOCHA_ID_PROP_NAME]: this.id
  };
};
}

module.exports = Test;
