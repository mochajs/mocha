
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
 * Fail the given `test`.
 *
 * @param {Test} test
 * @param {Error} err
 * @api private
 */

Runner.prototype.fail = function(test, err){
  test.failed = true;
  this.emit('fail', test, err);
};

/**
 * Run hook `name` callbacks and then invoke `fn(err)`.
 *
 * @param {String} name
 * @param {Function} function
 * @api private
 */

Runner.prototype.hook = function(name, fn){
  var suite = this.suite
    , test = this.test
    , callbacks = suite[name + 'Callbacks']
    , pending = callbacks.length;

  function next(i) {
    var callback = callbacks[i]
    if (!callback) return fn();

    // async
    if (1 == callback.length) {
      // async
      try {
        callback(function(err){
          if (err) return fn(err);
          next(++i);
        });
      } catch (err) {
        fn(err);
      }
      return;
    }

    // serial
    try {
      callback();
      next(++i);
    } catch (err) {
      fn(err);
    }
  }

  next(0);
};

/**
 * Run the current test and callback `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTest = function(fn){
  var test = this.test;

  // run the test
  try {
    // async
    if (test.async) return test.run(fn);
    // sync  
    test.run();
    fn();
  } catch (err) {
    fn(err);
  }
};

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
    , tests = suite.tests
    , test;

  function next(err) {
    // error handling
    if (err) {
      if (!test) throw err;
      self.fail(test, err);
    }

    // next test
    test = tests.shift();

    // all done
    if (!test) return fn();

    // execute test and hook(s)
    self.emit('test', self.test = test);
    self.hook('beforeEach', function(err){
      if (err) return next(err);
      self.runTest(function(err){
        if (err) return next(err);
        self.emit('pass', test);
        test.passed = true;
        self.emit('test end', test);
        self.hook('afterEach', next);
      });
    });
  }

  next();
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
  var self = this
    , i = 0;

  this.emit('suite', this.suite = suite);

  function next(err) {
    var curr = suite.suites[i++];
    if (!curr) return fn();
    self.runSuite(curr, next);
  }

  this.hook('beforeAll', function(err){
    self.runTests(suite, function(err){
      self.hook('afterAll', next);
    });
  });
};

/**
 * Run the root suite.
 *
 * @api public
 */

Runner.prototype.run = function(){
  var self = this;

  // run suites
  this.emit('start');
  this.runSuite(this.suite, function(){
    self.emit('end');
  });

  // uncaught exception
  process.on('uncaughtException', function(err){
    self.fail(self.test, err);
    self.emit('end');
  });

  return this;
};
