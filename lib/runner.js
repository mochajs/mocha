
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , Test = require('./test')
  , noop = function(){};

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
  var self = this;
  this.suite = suite;
  this.total = suite.total();
  this.globals = Object.keys(global).concat(['errno']);
  this.on('test end', function(test){ self.checkGlobals(test); });
  this.grep(/.*/);
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Runner.prototype.__proto__ = EventEmitter.prototype;

/**
 * Run tests with full titles matching `re`.
 *
 * @param {RegExp} re
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.grep = function(re){
  this._grep = re;
  return this;
};

/**
 * Check for global variable leaks.
 *
 * @api private
 */

Runner.prototype.checkGlobals = function(test){
  var leaks = Object.keys(global).filter(function(key){
    return !~this.globals.indexOf(key);
  }, this);

  this.globals = this.globals.concat(leaks);

  if (leaks.length > 1) {
    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));
  } else if (leaks.length) {
    this.fail(test, new Error('global leak detected: ' + leaks[0]));
  }
};

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
 * Fail the given `hook` name.
 *
 * @param {String} hook
 * @param {Error} err
 * @api private
 */

Runner.prototype.failHook = function(hook, err){
  var test = new Test(hook + ' hook', noop);
  test.parent = this.suite;
  this.fail(test, err);
  this.emit('end');
  process.exit(0);
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
    , callbacks = suite[name + 'Callbacks']
    , ms = suite._timeout
    , timer;

  function next(i) {
    var callback = callbacks[i];
    if (!callback) return fn();

    // async
    if (1 == callback.length) {
      // timeout
      timer = setTimeout(function(){
        fn(new Error('timeout of ' + ms + 'ms exceeded'));
      }, ms);

      // async
      try {
        callback(function(err){
          clearTimeout(timer);
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
      process.nextTick(function(){
        next(++i);
      });
    } catch (err) {
      fn(err);
    }
  }

  process.nextTick(function(){
    next(0);
  });
};

/**
 * Run hook `name` for the given array of `suites`
 * in order, and callback `fn(err)`.
 *
 * @param {String} name
 * @param {Array} suites
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hooks = function(name, suites, fn){
  var self = this
    , orig = this.suite;

  function next(suite) {
    self.suite = suite;

    if (!suite) {
      self.suite = orig;
      return fn();
    }

    self.hook(name, function(err){
      if (err) {
        self.suite = orig;
        return fn(err);
      }

      next(suites.pop());
    });
  }

  next(suites.pop());
};

/**
 * Run hooks from the top level down.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookUp = function(name, fn){
  var suites = [this.suite].concat(this.parents()).reverse();
  this.hooks(name, suites, fn);
};

/**
 * Run hooks from the bottom up.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookDown = function(name, fn){
  var suites = [this.suite].concat(this.parents());
  this.hooks(name, suites, fn);
};

/**
 * Return an array of parent Suites from
 * closest to furthest.
 *
 * @return {Array}
 * @api private
 */

Runner.prototype.parents = function(){
  var suite = this.suite
    , suites = [];
  while (suite = suite.parent) suites.push(suite);
  return suites;
};

/**
 * Run the current test and callback `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTest = function(fn){
  var test = this.test
    , self = this;

  // async
  if (test.async) {
    try {
      return test.run(function(err){
        if (test.finished) {
          self.fail(test, new Error('done() called multiple times'));
          return;
        }
        fn(err);
      });
    } catch (err) {
      fn(err);
    }
  }

  // sync  
  process.nextTick(function(){
    try {
      test.run();
      fn();
    } catch (err) {
      fn(err);
    }
  });
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
      self.fail(test, err);
      self.emit('test end', test);
    }

    // next test
    test = tests.shift();

    // all done
    if (!test) return fn();

    // grep
    if (!self._grep.test(test.fullTitle())) return next();

    // pending
    if (test.pending) {
      self.emit('pending', test);
      self.emit('test end', test);
      return next();
    }

    // execute test and hook(s)
    self.emit('test', self.test = test);
    self.hookDown('beforeEach', function(err){
      if (err) return self.failHook('beforeEach', err);
      self.runTest(function(err){
        if (err) return next(err);
        self.emit('pass', test);
        test.passed = true;
        self.emit('test end', test);
        if (err) return self.failHook('beforeEach', err);
        self.hookUp('afterEach', function(err){
          if (err) return self.failHook('afterEach', err);
          next();
        });
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

  function next() {
    var curr = suite.suites[i++];
    if (!curr) return done();
    self.runSuite(curr, next);
  }

  function done() {
    self.suite = suite;
    self.hook('afterAll', function(err){
      if (err) return self.failHook('afterAll', err);
      self.emit('suite end', suite);
      fn();
    });
  }

  this.hook('beforeAll', function(err){
    if (err) return self.failHook('beforeAll', err);
    self.runTests(suite, next);
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
    self.emit('test end', self.test);
    self.emit('end');
  });

  return this;
};
