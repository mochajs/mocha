
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

/**
 * Expose `Runner`.
 */

module.exports = Runner;

/**
 * Initialize a `Runner` for the given `suite`.
 *
 * Events:
 *
 *   - `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 *
 * @api public
 */

function Runner(suite) {
  this.suite = suite;
  this.total = suite.total();
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Runner.prototype.__proto__ = EventEmitter.prototype;

/**
 * Run tests in the given `suite` and invoke
 * the callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTests = function(suite, fn){
  var self = this
    , tests = suite.tests;

/**
 * Add a test `suite`.
 *
 * @param {Suite} suite
 * @return {Suite} for chaining
 * @api private
 */
  function run(test) {
    if (!test) return fn();
    self.emit('test', test);
    // run any befores first
    suite.setup.forEach(function(fn){
      fn();
    });
    // run the test
    try {
      // async
      if (test.async) {
        test.run(function(err){
          if (err) {
            test.failed = true
            self.emit('fail', test, err);
          } else {
            self.emit('pass', test);
          }
          self.emit('test end', test);
          run(tests.shift());
        });
      // sync  
      } else {
        test.run();
        test.passed = true;
        self.emit('pass', test);
      }
    } catch (err) {
      test.failed = true;
      self.emit('fail', test, err);
    }

    // run the next test
    if (test.sync) {
      self.emit('test end', test);
      // teardown hook
      suite.tearDown.forEach(function(fn){
        fn();
      });
      run(tests.shift());
    }
  }

  run(tests.shift());
};

/**
 * Run the given `suite` and invoke the
 * callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runSuite = function(suite, fn){
  var self = this;

  this.emit('suite', suite);

  // run sub-suites
  var pending = suite.suites.length + 1;
  suite.suites.forEach(function(suite){
    self.runSuite(suite, function(){
      --pending || fn();
    });
  });

  // run tests
  this.runTests(suite, function(){
    --pending || fn();
  });
};

/**
 * Run the root suite.
 *
 * @api public
 */

Runner.prototype.run = function(){
  var self = this;
  this.emit('start');
  this.runSuite(this.suite, function(){
    self.emit('end');
  });
  return this;
};
