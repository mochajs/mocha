
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

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

Runner.prototype.runTests = function(suite, fn){
  var self = this
    , tests = suite.tests;

  function run(test) {
    if (!test) return fn();
    self.emit('test', test);

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
      run(tests.shift());
    }
  }

  run(tests.shift());
};

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

Runner.prototype.run = function(){
  var self = this;
  this.emit('start');
  this.runSuite(this.suite, function(){
    self.emit('end');
  });
  return this;
};
