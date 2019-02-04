'use strict';

var Mocha = require('../../lib/mocha');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;
var Runnable = Mocha.Runnable;
var Hook = Mocha.Hook;
var path = require('path');
var noop = Mocha.utils.noop;
var EVENT_TEST_FAIL = Runner.constants.EVENT_TEST_FAIL;
var EVENT_TEST_RETRY = Runner.constants.EVENT_TEST_RETRY;
var EVENT_RUN_END = Runner.constants.EVENT_RUN_END;
var STATE_FAILED = Runnable.constants.STATE_FAILED;

describe('Runner', function() {
  var suite;
  var runner;

  beforeEach(function() {
    suite = new Suite('Suite', 'root');
    runner = new Runner(suite);
  });

  describe('.grep()', function() {
    it('should update the runner.total with number of matched tests', function() {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      var newRunner = new Runner(suite);
      newRunner.grep(/lions/);
      expect(newRunner.total, 'to be', 2);
    });

    it('should update the runner.total with number of matched tests when inverted', function() {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      var newRunner = new Runner(suite);
      newRunner.grep(/lions/, true);
      expect(newRunner.total, 'to be', 1);
    });
  });

  describe('.grepTotal()', function() {
    it('should return the total number of matched tests', function() {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      runner.grep(/lions/);
      expect(runner.grepTotal(suite), 'to be', 2);
    });

    it('should return the total number of matched tests when inverted', function() {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      runner.grep(/lions/, true);
      expect(runner.grepTotal(suite), 'to be', 1);
    });
  });

  describe('.globalProps()', function() {
    it('should include common non enumerable globals', function() {
      var props = runner.globalProps();
      expect(
        props,
        'to contain',
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
        'XMLHttpRequest'
      );
    });
  });

  describe('.globals()', function() {
    it('should default to the known globals', function() {
      expect(runner.globals().length, 'to be greater than', 16);
    });

    it('should white-list globals', function() {
      runner.globals(['foo', 'bar']);
      expect(runner.globals(), 'to contain', 'foo', 'bar');
    });
  });

  describe('.checkGlobals(test)', function() {
    before(function() {
      if (!Object.create) {
        this.skip();
      }
    });

    it('should allow variables that match a wildcard', function(done) {
      runner.globals(['foo*', 'giz*']);
      global.foo = 'baz';
      global.gizmo = 'quux';
      runner.checkGlobals();
      delete global.foo;
      delete global.gizmo;
      done();
    });

    it('should emit "fail" when a new global is introduced', function(done) {
      var test = new Test('im a test', noop);
      runner.checkGlobals();
      global.foo = 'bar';
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_test, 'to be', test);
        expect(_err, 'to have message', 'global leak detected: foo');
        delete global.foo;
        done();
      });
      runner.checkGlobals(test);
    });

    it('should emit "fail" when a single new disallowed global is introduced after a single extra global is allowed', function(done) {
      var doneCalled = false;
      runner.globals('good');
      global.bad = 1;
      runner.on(EVENT_TEST_FAIL, function() {
        delete global.bad;
        done();
        doneCalled = true;
      });
      runner.checkGlobals(new Test('yet another test', noop));
      if (!doneCalled) {
        done(Error('Expected test failure did not occur.'));
      }
    });

    it('should not fail when a new common global is introduced', function() {
      if (process.browser) {
        this.skip();
        return;
      }
      // verify that the prop isn't enumerable
      expect(global.propertyIsEnumerable('XMLHttpRequest'), 'to be', false);

      // create a new runner and keep a reference to the test.
      var test = new Test('im a test about bears', noop);
      suite.addTest(test);
      var newRunner = new Runner(suite);

      // make the prop enumerable again.
      global.XMLHttpRequest = noop;
      expect(global.propertyIsEnumerable('XMLHttpRequest'), 'to be', true);

      // verify the test hasn't failed.
      newRunner.checkGlobals(test);
      expect(test, 'not to have key', 'state');

      // clean up our global space.
      delete global.XMLHttpRequest;
    });

    it('should pluralize the error message when several are introduced', function(done) {
      var test = new Test('im a test', noop);
      runner.checkGlobals();
      global.foo = 'bar';
      global.bar = 'baz';
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_test, 'to be', test);
        expect(_err, 'to have message', 'global leaks detected: foo, bar');
        delete global.foo;
        delete global.bar;
        done();
      });
      runner.checkGlobals(test);
    });

    it('should respect per test whitelisted globals', function() {
      var test = new Test('im a test about lions', noop);
      test.globals(['foo']);

      suite.addTest(test);
      var runner = new Runner(suite);

      global.foo = 'bar';

      // verify the test hasn't failed.
      runner.checkGlobals(test);
      expect(test, 'not to have key', 'state');

      delete global.foo;
    });

    it('should respect per test whitelisted globals but still detect other leaks', function(done) {
      var test = new Test('im a test about lions', noop);
      test.globals(['foo']);

      suite.addTest(test);

      global.foo = 'bar';
      global.bar = 'baz';
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_test.title, 'to be', 'im a test about lions');
        expect(_err, 'to have message', 'global leak detected: bar');
        delete global.foo;
        done();
      });
      runner.checkGlobals(test);
    });

    it('should emit "fail" when a global beginning with d is introduced', function(done) {
      global.derp = 'bar';
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        expect(test.title, 'to be', 'herp');
        expect(err.message, 'to be', 'global leak detected: derp');
        delete global.derp;
        done();
      });
      runner.checkGlobals(new Test('herp', noop));
    });
  });

  describe('.hook(name, fn)', function() {
    it('should execute hooks after failed test if suite bail is true', function(done) {
      runner.fail(new Test('failed test', noop), new Error());
      suite.bail(true);
      suite.afterEach(function() {
        suite.afterAll(function() {
          done();
        });
      });
      runner.hook('afterEach', noop);
      runner.hook('afterAll', noop);
    });
  });

  describe('.fail(test, err)', function() {
    it('should increment .failures', function() {
      expect(runner.failures, 'to be', 0);
      runner.fail(new Test('one', noop), {});
      expect(runner.failures, 'to be', 1);
      runner.fail(new Test('two', noop), new Error());
      expect(runner.failures, 'to be', 2);
    });

    it('should set test.state to "failed"', function() {
      var test = new Test('some test', noop);
      runner.fail(test, 'some error');
      expect(test.state, 'to be', STATE_FAILED);
    });

    it('should emit "fail"', function(done) {
      var test = new Test('some other test', noop);
      var err = {};
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_test, 'to be', test);
        expect(_err, 'to be an', Error);
        expect(_err, 'not to be', {});
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a helpful message when failed with a string', function(done) {
      var test = new Test('helpful test', noop);
      var err = 'string';
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_err, 'to be an', Error);
        expect(
          _err,
          'to have message',
          'the string "string" was thrown, throw an Error :)'
        );
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a the error when failed with an Error instance', function(done) {
      var test = new Test('a test', noop);
      var err = new Error('an error message');
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_err, 'to be an', Error);
        expect(_err, 'to have message', 'an error message');
        done();
      });
      runner.fail(test, err);
    });

    it('should emit the error when failed with an Error-like object', function(done) {
      var test = new Test('a test', noop);
      var err = {message: 'an error message'};
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_err, 'not to be an', Error);
        expect(_err.message, 'to be', 'an error message');
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a helpful message when failed with an Object', function(done) {
      var test = new Test('a test', noop);
      var err = {x: 1};
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_err, 'to be an', Error);
        expect(
          _err,
          'to have message',
          'the object {\n  "x": 1\n} was thrown, throw an Error :)'
        );
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a helpful message when failed with an Array', function(done) {
      var test = new Test('a test', noop);
      var err = [1, 2];
      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_err, 'to be an', Error);
        expect(
          _err,
          'to have message',
          'the array [\n  1\n  2\n] was thrown, throw an Error :)'
        );
        done();
      });
      runner.fail(test, err);
    });

    it('should recover if the error stack is not writable', function(done) {
      if (!Object.create) {
        this.skip();
        return;
      }

      var err = new Error('not evil');
      Object.defineProperty(err, 'stack', {
        value: err.stack
      });
      var test = new Test('a test', noop);

      runner.on(EVENT_TEST_FAIL, function(_test, _err) {
        expect(_err, 'to have message', 'not evil');
        done();
      });

      runner.fail(test, err);
    });

    it('should return and not increment failures when test is pending', function() {
      var test = new Test('a test');
      suite.addTest(test);
      test.pending = true;
      runner.fail(test, new Error());
      expect(runner.failures, 'to be', 0);
    });
  });

  describe('.failHook(hook, err)', function() {
    it('should increment .failures', function() {
      expect(runner.failures, 'to be', 0);
      var test1 = new Test('fail hook 1', noop);
      var test2 = new Test('fail hook 2', noop);
      suite.addTest(test1);
      suite.addTest(test2);
      runner.failHook(test1, new Error('error1'));
      expect(runner.failures, 'to be', 1);
      runner.failHook(test2, new Error('error2'));
      expect(runner.failures, 'to be', 2);
    });

    it('should augment hook title with current test title', function() {
      var hook = new Hook('"before each" hook');
      hook.ctx = {currentTest: new Test('should behave', noop)};

      runner.failHook(hook, {});
      expect(hook.title, 'to be', '"before each" hook for "should behave"');

      hook.ctx.currentTest = new Test('should obey', noop);
      runner.failHook(hook, {});
      expect(hook.title, 'to be', '"before each" hook for "should obey"');
    });

    it('should emit "fail"', function(done) {
      var hook = new Hook();
      hook.parent = suite;
      var err = new Error('error');
      runner.on(EVENT_TEST_FAIL, function(_hook, _err) {
        expect(_hook, 'to be', hook);
        expect(_err, 'to be', err);
        done();
      });
      runner.failHook(hook, err);
    });

    it('should not emit "end" if suite bail is not true', function(done) {
      var hook = new Hook();
      hook.parent = suite;
      var err = new Error('error');
      suite.bail(false);
      runner.on(EVENT_RUN_END, function() {
        throw new Error('"end" was emit, but the bail is false');
      });
      runner.failHook(hook, err);
      done();
    });
  });

  describe('.run(fn)', function() {
    it('should emit "retry" when a retryable test fails', function(done) {
      var retries = 2;
      var retryableFails = 0;
      var err = new Error('bear error');

      var test = new Test('im a test about bears', function() {
        if (retryableFails < retries) {
          throw err;
        }
      });

      suite.retries(retries);
      suite.addTest(test);

      runner.on(EVENT_TEST_RETRY, function(testClone, testErr) {
        retryableFails += 1;
        expect(testClone.title, 'to be', test.title);
        expect(testErr, 'to be', err);
      });

      runner.run(function(failures) {
        expect(failures, 'to be', 0);
        expect(retryableFails, 'to be', retries);

        done();
      });
    });
  });

  describe('allowUncaught', function() {
    it('should allow unhandled errors to propagate through', function(done) {
      var newRunner = new Runner(suite);
      newRunner.allowUncaught = true;
      newRunner.test = new Test('failing test', function() {
        throw new Error('allow unhandled errors');
      });
      function fail() {
        newRunner.runTest();
      }
      expect(fail, 'to throw', 'allow unhandled errors');
      done();
    });
  });

  describe('stackTrace', function() {
    var stack = [
      'AssertionError: foo bar',
      'at EventEmitter.<anonymous> (/usr/local/dev/test.js:16:12)',
      'at Context.<anonymous> (/usr/local/dev/test.js:19:5)',
      'Test.Runnable.run (/usr/local/lib/node_modules/mocha/lib/runnable.js:244:7)',
      'Runner.runTest (/usr/local/lib/node_modules/mocha/lib/runner.js:374:10)',
      '/usr/local/lib/node_modules/mocha/lib/runner.js:452:12',
      'next (/usr/local/lib/node_modules/mocha/lib/runner.js:299:14)',
      '/usr/local/lib/node_modules/mocha/lib/runner.js:309:7',
      'next (/usr/local/lib/node_modules/mocha/lib/runner.js:248:23)',
      'Immediate._onImmediate (/usr/local/lib/node_modules/mocha/lib/runner.js:276:5)',
      'at processImmediate [as _immediateCallback] (timers.js:321:17)'
    ];

    before(function() {
      // Only for Node running on Windows
      if (process.platform === 'win32') {
        var addDrive = function(str) {
          var drive = 'C:';
          var pos = str.indexOf(path.posix.sep);
          return pos !== -1 ? str.slice(0, pos) + drive + str.slice(pos) : str;
        };

        var useWinPathSep = function(str) {
          return str.split(path.posix.sep).join(path.win32.sep);
        };

        // Fake Windows pathnames in stacktrace
        stack = stack.map(function(line) {
          return useWinPathSep(addDrive(line));
        });
      }
    });

    describe('shortStackTrace', function() {
      before(function() {
        if (process.browser) {
          this.skip();
        }
      });

      it('should prettify the stack-trace', function(done) {
        var hook = new Hook();
        hook.parent = suite;
        var err = new Error();
        // Fake stack-trace
        err.stack = stack.join('\n');

        runner.on(EVENT_TEST_FAIL, function(_hook, _err) {
          expect(_err.stack, 'to be', stack.slice(0, 3).join('\n'));
          done();
        });
        runner.failHook(hook, err);
      });
    });

    describe('longStackTrace', function() {
      it('should display the full stack-trace', function(done) {
        var hook = new Hook();
        hook.parent = suite;
        var err = new Error();
        // Fake stack-trace
        err.stack = stack.join('\n');
        // Add --stack-trace option
        runner.fullStackTrace = true;

        runner.on(EVENT_TEST_FAIL, function(_hook, _err) {
          expect(_err.stack, 'to be', stack.join('\n'));
          done();
        });
        runner.failHook(hook, err);
      });
    });

    describe('hugeStackTrace', function() {
      before(function() {
        if (process.browser) {
          this.skip();
        }
      });

      // Generate 64k string
      function genOverlongSingleLineMessage() {
        var n = 8200;
        var data = [];
        data.length = n;
        for (var i = 0; i < n; i++) {
          data[i] = {a: 1};
        }
        return JSON.stringify(data);
      }

      // Generate 64k string
      function genOverlongMultiLineMessage() {
        var n = 1150;
        var data = [];
        data.length = n;
        var str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        for (var i = 0; i < n; i++) {
          data[i] = str;
        }
        return data.join('\n');
      }

      it('should not hang if overlong error message is single line', function(done) {
        var hook = new Hook();
        hook.parent = suite;
        var message = genOverlongSingleLineMessage();
        var err = new Error();
        // Fake stack-trace
        err.stack = [message].concat(stack).join('\n');

        runner.on('fail', function(_hook, _err) {
          var filteredErrStack = _err.stack.split('\n').slice(1);
          expect(
            filteredErrStack.join('\n'),
            'to be',
            stack.slice(0, 3).join('\n')
          );
          done();
        });
        runner.failHook(hook, err);
      });

      it('should not hang if overlong error message is multiple lines', function(done) {
        var hook = new Hook();
        hook.parent = suite;
        var message = genOverlongMultiLineMessage();
        var err = new Error();
        // Fake stack-trace
        err.stack = [message].concat(stack).join('\n');

        runner.on('fail', function(_hook, _err) {
          var filteredErrStack = _err.stack.split('\n').slice(-3);
          expect(
            filteredErrStack.join('\n'),
            'to be',
            stack.slice(0, 3).join('\n')
          );
          done();
        });
        runner.failHook(hook, err);
      });
    });
  });

  describe('abort', function() {
    it('should set _abort property to true', function() {
      runner.abort();
      expect(runner._abort, 'to be true');
    });

    it('should return the Runner', function() {
      expect(runner.abort(), 'to be', runner);
    });
  });
});
