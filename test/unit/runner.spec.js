'use strict';

const path = require('path');
const sinon = require('sinon');
const Mocha = require('../../lib/mocha');
const Pending = require('../../lib/pending');
const {Suite, Runner, Test, Hook, Runnable} = Mocha;
const {noop} = Mocha.utils;
const {FATAL, MULTIPLE_DONE, UNSUPPORTED} =
  require('../../lib/errors').constants;

const {
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_RETRY,
  EVENT_TEST_END,
  EVENT_RUN_END,
  EVENT_SUITE_END,
  STATE_IDLE,
  STATE_RUNNING,
  STATE_STOPPED
} = Runner.constants;
const {STATE_FAILED} = Mocha.Runnable.constants;

describe('Runner', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('instance method', function () {
    let suite;
    let runner;
    beforeEach(function () {
      suite = new Suite('Suite', 'root');
      runner = new Runner(suite, {cleanReferencesAfterRun: true});
      runner.checkLeaks = true;
    });

    describe('grep()', function () {
      it('should update the runner.total with number of matched tests', function () {
        suite.addTest(new Test('im a test about lions', noop));
        suite.addTest(new Test('im another test about lions', noop));
        suite.addTest(new Test('im a test about bears', noop));
        var newRunner = new Runner(suite);
        newRunner.grep(/lions/);
        expect(newRunner.total, 'to be', 2);
      });

      it('should update the runner.total with number of matched tests when inverted', function () {
        suite.addTest(new Test('im a test about lions', noop));
        suite.addTest(new Test('im another test about lions', noop));
        suite.addTest(new Test('im a test about bears', noop));
        var newRunner = new Runner(suite);
        newRunner.grep(/lions/, true);
        expect(newRunner.total, 'to be', 1);
      });
    });

    describe('grepTotal()', function () {
      it('should return the total number of matched tests', function () {
        suite.addTest(new Test('im a test about lions', noop));
        suite.addTest(new Test('im another test about lions', noop));
        suite.addTest(new Test('im a test about bears', noop));
        runner.grep(/lions/);
        expect(runner.grepTotal(suite), 'to be', 2);
      });

      it('should return the total number of matched tests when inverted', function () {
        suite.addTest(new Test('im a test about lions', noop));
        suite.addTest(new Test('im another test about lions', noop));
        suite.addTest(new Test('im a test about bears', noop));
        runner.grep(/lions/, true);
        expect(runner.grepTotal(suite), 'to be', 1);
      });
    });
    describe('globalProps()', function () {
      it('should include common non enumerable globals', function () {
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

    describe('globals()', function () {
      it('should default to the known globals', function () {
        expect(runner.globals().length, 'to be greater than', 16);
      });

      it('should white-list globals', function () {
        runner.globals(['foo', 'bar']);
        expect(runner.globals(), 'to contain', 'foo', 'bar');
      });
    });

    describe('checkGlobals(test)', function () {
      before(function () {
        if (!Object.create) {
          this.skip();
        }
      });

      it('should allow variables that match a wildcard', function (done) {
        runner.globals(['foo*', 'giz*']);
        global.foo = 'baz';
        global.gizmo = 'quux';
        runner.checkGlobals();
        delete global.foo;
        delete global.gizmo;
        done();
      });

      it('should emit "fail" when a new global is introduced', function (done) {
        var test = new Test('im a test', noop);
        runner.checkGlobals();
        global.foo = 'bar';
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_test, 'to be', test);
          expect(_err, 'to have message', "global leak(s) detected: 'foo'");
          delete global.foo;
          done();
        });
        runner.checkGlobals(test);
      });

      it('should emit "fail" when a single new disallowed global is introduced after a single extra global is allowed', function (done) {
        var doneCalled = false;
        runner.globals('good');
        global.bad = 1;
        runner.on(EVENT_TEST_FAIL, function () {
          delete global.bad;
          done();
          doneCalled = true;
        });
        runner.checkGlobals(new Test('yet another test', noop));
        if (!doneCalled) {
          done(Error('Expected test failure did not occur.'));
        }
      });

      it('should not fail when a new common global is introduced', function () {
        if (process.browser) {
          this.skip();
          return;
        }
        // verify that the prop isn't enumerable
        expect(
          Object.prototype.propertyIsEnumerable.call(global, 'XMLHttpRequest'),
          'to be',
          false
        );

        // create a new runner and keep a reference to the test.
        var test = new Test('im a test about bears', noop);
        suite.addTest(test);
        var newRunner = new Runner(suite);

        // make the prop enumerable again.
        global.XMLHttpRequest = noop;
        expect(
          Object.prototype.propertyIsEnumerable.call(global, 'XMLHttpRequest'),
          'to be',
          true
        );

        // verify the test hasn't failed.
        newRunner.checkGlobals(test);
        expect(test, 'not to have key', 'state');

        // clean up our global space.
        delete global.XMLHttpRequest;
      });

      it('should pluralize the error message when several are introduced', function (done) {
        var test = new Test('im a test', noop);
        runner.checkGlobals();
        global.foo = 'bar';
        global.bar = 'baz';
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_test, 'to be', test);
          expect(
            _err.message,
            'to be',
            "global leak(s) detected: 'foo', 'bar'"
          );
          delete global.foo;
          delete global.bar;
          done();
        });
        runner.checkGlobals(test);
      });

      it('should respect per test whitelisted globals', function () {
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

      it('should respect per test whitelisted globals but still detect other leaks', function (done) {
        var test = new Test('im a test about lions', noop);
        test.globals(['foo']);

        suite.addTest(test);

        global.foo = 'whitelisted';
        global.bar = 'detect-me';
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_test.title, 'to be', 'im a test about lions');
          expect(_err, 'to have message', "global leak(s) detected: 'bar'");
          delete global.foo;
          delete global.bar;
          done();
        });
        runner.checkGlobals(test);
      });

      it('should emit "fail" when a global beginning with "d" is introduced', function (done) {
        global.derp = 'bar';
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_test.title, 'to be', 'herp');
          expect(_err, 'to have message', "global leak(s) detected: 'derp'");
          delete global.derp;
          done();
        });
        runner.checkGlobals(new Test('herp', noop));
      });
    });
    describe('hook()', function () {
      it('should execute hooks after failed test if suite bail is true', function (done) {
        runner.fail(new Test('failed test', noop), new Error());
        suite.bail(true);
        suite.afterEach(function () {
          suite.afterAll(function () {
            done();
          });
        });
        runner.hook('afterEach', noop);
        runner.hook('afterAll', noop);
      });

      it('should augment hook title with current test title', function (done) {
        var expectedHookTitle;
        function assertHookTitle() {
          expect(hook.title, 'to be', expectedHookTitle);
        }
        var failHook = false;
        var hookError = new Error('failed hook');
        suite.beforeEach(function () {
          assertHookTitle();
          if (failHook) {
            throw hookError;
          }
        });
        runner.on(EVENT_HOOK_BEGIN, assertHookTitle);
        runner.on(EVENT_HOOK_END, assertHookTitle);
        runner.on(EVENT_TEST_FAIL, assertHookTitle);
        runner.on(EVENT_TEST_PASS, assertHookTitle);
        var hook = suite._beforeEach[0];

        suite.addTest(new Test('should behave', noop));
        suite.addTest(new Test('should obey', noop));
        runner.suite = suite;

        runner.test = suite.tests[0];
        expectedHookTitle = '"before each" hook for "should behave"';
        runner.hook('beforeEach', function (err) {
          if (err && err !== hookError) return done(err);

          runner.test = suite.tests[1];
          failHook = true;
          expectedHookTitle = '"before each" hook for "should obey"';
          runner.hook('beforeEach', function (err) {
            if (err && err !== hookError) return done(err);
            return done();
          });
        });
      });
    });

    describe('fail()', function () {
      it('should increment `Runner#failures`', function () {
        expect(runner.failures, 'to be', 0);
        runner.fail(new Test('one', noop), {});
        expect(runner.failures, 'to be', 1);
        runner.fail(new Test('two', noop), new Error());
        expect(runner.failures, 'to be', 2);
      });

      it('should set `Test#state` to "failed"', function () {
        var test = new Test('some test', noop);
        runner.fail(test, 'some error');
        expect(test.state, 'to be', STATE_FAILED);
      });

      it('should emit "fail"', function (done) {
        var test = new Test('some other test', noop);
        var err = {};
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_test, 'to be', test);
          expect(_err, 'to be an', Error);
          expect(_err, 'not to be', {});
          done();
        });
        runner.fail(test, err);
      });

      it('should emit a helpful message when failed with a string', function (done) {
        var test = new Test('helpful test', noop);
        var err = 'string';
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
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

      it('should emit a the error when failed with an Error instance', function (done) {
        var test = new Test('a test', noop);
        var err = new Error('an error message');
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_err, 'to be an', Error);
          expect(_err, 'to have message', 'an error message');
          done();
        });
        runner.fail(test, err);
      });

      it('should emit the error when failed with an Error-like object', function (done) {
        var test = new Test('a test', noop);
        var err = {message: 'an error message'};
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_err, 'not to be an', Error);
          expect(_err.message, 'to be', 'an error message');
          done();
        });
        runner.fail(test, err);
      });

      it('should emit a helpful message when failed with an Object', function (done) {
        var test = new Test('a test', noop);
        var err = {x: 1};
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
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

      it('should emit a helpful message when failed with an Array', function (done) {
        var test = new Test('a test', noop);
        var err = [1, 2];
        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
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

      it('should recover if the error stack is not writable', function (done) {
        if (!Object.create) {
          this.skip();
          return;
        }

        var err = new Error('not evil');
        Object.defineProperty(err, 'stack', {
          value: err.stack
        });
        var test = new Test('a test', noop);

        runner.on(EVENT_TEST_FAIL, function (_test, _err) {
          expect(_err, 'to have message', 'not evil');
          done();
        });

        runner.fail(test, err);
      });

      it('should return and not increment failures when test is pending', function () {
        var test = new Test('a test');
        suite.addTest(test);
        test.pending = true;
        runner.fail(test, new Error());
        expect(runner.failures, 'to be', 0);
      });

      describe('when Runner has stopped', function () {
        beforeEach(function () {
          runner.state = STATE_STOPPED;
        });

        describe('when test is not pending', function () {
          describe('when error is the "multiple done" variety', function () {
            it('should throw the "multiple done" error', function () {
              var test = new Test('test', function () {});
              suite.addTest(test);
              var err = new Error();
              err.code = MULTIPLE_DONE;
              expect(
                function () {
                  runner.fail(test, err);
                },
                'to throw',
                err
              );
            });
          });

          describe('when error is not of the "multiple done" variety', function () {
            it('should throw a "fatal" error', function () {
              var test = new Test('test', function () {});
              suite.addTest(test);
              var err = new Error();
              expect(
                function () {
                  runner.fail(test, err);
                },
                'to throw',
                {
                  code: FATAL
                }
              );
            });
          });
        });
      });
      it('should increment .failures', function () {
        expect(runner.failures, 'to be', 0);
        var test1 = new Test('fail hook 1', noop);
        var test2 = new Test('fail hook 2', noop);
        suite.addTest(test1);
        suite.addTest(test2);
        runner.fail(test1, new Error('error1'));
        expect(runner.failures, 'to be', 1);
        runner.fail(test2, new Error('error2'));
        expect(runner.failures, 'to be', 2);
      });

      it('should emit "fail"', function (done) {
        var hook = new Hook();
        hook.parent = suite;
        var err = new Error('error');
        runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
          expect(_hook, 'to be', hook);
          expect(_err, 'to be', err);
          done();
        });
        runner.fail(hook, err);
      });

      it('should not emit "end" if suite bail is not true', function (done) {
        var hook = new Hook();
        hook.parent = suite;
        var err = new Error('error');
        suite.bail(false);
        expect(
          function () {
            runner.fail(hook, err);
          },
          'not to emit from',
          hook,
          EVENT_RUN_END
        );
        done();
      });
    });

    describe('run()', function () {
      it('should emit "retry" when a retryable test fails', function (done) {
        var retries = 2;
        var retryableFails = 0;
        var err = new Error('bear error');

        var test = new Test('im a test about bears', function () {
          if (retryableFails < retries) {
            throw err;
          }
        });

        suite.retries(retries);
        suite.addTest(test);

        runner.on(EVENT_TEST_RETRY, function (testClone, testErr) {
          retryableFails += 1;
          expect(testClone.title, 'to be', test.title);
          expect(testErr, 'to be', err);
        });

        runner.run(function (failures) {
          expect(failures, 'to be', 0);
          expect(retryableFails, 'to be', retries);

          done();
        });
      });

      // karma-mocha is inexplicably doing this with a Hook
      it('should not throw an exception if something emits EVENT_TEST_END with a non-Test object', function () {
        expect(function () {
          runner.emit(EVENT_TEST_END, {});
        }, 'not to throw');
      });

      it('should clean references after a run', function () {
        runner = new Runner(suite, {
          delay: false,
          cleanReferencesAfterRun: true
        });
        var cleanReferencesStub = sinon.stub(suite, 'cleanReferences');
        runner.run();
        runner.emit(EVENT_SUITE_END, suite);
        expect(cleanReferencesStub, 'was called once');
      });

      it('should not clean references after a run when `cleanReferencesAfterRun` is `false`', function () {
        runner = new Runner(suite, {
          delay: false,
          cleanReferencesAfterRun: false
        });
        var cleanReferencesStub = sinon.stub(suite, 'cleanReferences');
        runner.run();
        runner.emit(EVENT_SUITE_END, suite);
        expect(cleanReferencesStub, 'was not called');
      });

      it('should not leak `Process.uncaughtException` listeners', function (done) {
        var normalUncaughtExceptionListenerCount =
          process.listenerCount('uncaughtException');

        runner.run();
        runner.run();
        runner.run();
        expect(
          process.listenerCount('uncaughtException'),
          'to be',
          normalUncaughtExceptionListenerCount + 1
        );
        done();
      });

      describe('stack traces', function () {
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

        before(function () {
          // Only for Node running on Windows
          if (process.platform === 'win32') {
            var addDrive = function (str) {
              var drive = 'C:';
              var pos = str.indexOf(path.posix.sep);
              return pos !== -1
                ? str.slice(0, pos) + drive + str.slice(pos)
                : str;
            };

            var useWinPathSep = function (str) {
              return str.split(path.posix.sep).join(path.win32.sep);
            };

            // Fake Windows pathnames in stacktrace
            stack = stack.map(function (line) {
              return useWinPathSep(addDrive(line));
            });
          }
        });

        describe('short', function () {
          before(function () {
            if (process.browser) {
              this.skip();
            }
          });

          it('should prettify the stack-trace', function (done) {
            var hook = new Hook();
            hook.parent = suite;
            var err = new Error();
            // Fake stack-trace
            err.stack = stack.join('\n');

            runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
              expect(_err.stack, 'to be', stack.slice(0, 3).join('\n'));
              done();
            });
            runner.fail(hook, err);
          });

          it('should prettify stack-traces in error cause trail', function (done) {
            var hook = new Hook();
            hook.parent = suite;
            var causeErr = new Error();
            // Fake stack-trace
            causeErr.stack = stack.join('\n');
            var err = new Error();
            err.cause = causeErr;

            runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
              expect(_err.cause.stack, 'to be', stack.slice(0, 3).join('\n'));
              done();
            });
            runner.fail(hook, err);
          });
        });

        describe('long', function () {
          it('should display the full stack-trace', function (done) {
            var hook = new Hook();
            hook.parent = suite;
            var err = new Error();
            // Fake stack-trace
            err.stack = stack.join('\n');
            // Add --stack-trace option
            runner.fullStackTrace = true;

            runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
              expect(_err.stack, 'to be', stack.join('\n'));
              done();
            });
            runner.fail(hook, err);
          });

          it('should display full stack-traces in error cause trail', function (done) {
            var hook = new Hook();
            hook.parent = suite;
            var causeErr = new Error();
            // Fake stack-trace
            causeErr.stack = stack.join('\n');
            var err = new Error();
            err.cause = causeErr;
            // Add --stack-trace option
            runner.fullStackTrace = true;

            runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
              expect(_err.cause.stack, 'to be', stack.join('\n'));
              done();
            });
            runner.fail(hook, err);
          });
        });

        describe('ginormous', function () {
          before(function () {
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
            var str =
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            for (var i = 0; i < n; i++) {
              data[i] = str;
            }
            return data.join('\n');
          }

          it('should not hang if overlong error message is single line', function (done) {
            var hook = new Hook();
            hook.parent = suite;
            var message = genOverlongSingleLineMessage();
            var err = new Error();
            // Fake stack-trace
            err.stack = [message].concat(stack).join('\n');

            runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
              var filteredErrStack = _err.stack.split('\n').slice(1);
              expect(
                filteredErrStack.join('\n'),
                'to be',
                stack.slice(0, 3).join('\n')
              );
              done();
            });
            runner.fail(hook, err);
          });

          it('should not hang if overlong error message is multiple lines', function (done) {
            var hook = new Hook();
            hook.parent = suite;
            var message = genOverlongMultiLineMessage();
            var err = new Error();
            // Fake stack-trace
            err.stack = [message].concat(stack).join('\n');

            runner.on(EVENT_TEST_FAIL, function (_hook, _err) {
              var filteredErrStack = _err.stack.split('\n').slice(-3);
              expect(
                filteredErrStack.join('\n'),
                'to be',
                stack.slice(0, 3).join('\n')
              );
              done();
            });
            runner.fail(hook, err);
          });
        });
      });
    });

    describe('runAsync()', function () {
      beforeEach(function () {
        sinon.stub(runner, 'run').callsArgWithAsync(0, 42).returnsThis();
      });

      it('should return a Promise with a failure count', async function () {
        return expect(runner.runAsync(), 'to be fulfilled with', 42);
      });

      it('should pass through options to Runner#run', async function () {
        await runner.runAsync({foo: 'bar'});
        expect(runner.run, 'to have a call satisfying', [
          expect.it('to be a function'),
          {foo: 'bar'}
        ]).and('was called once');
      });
    });

    describe('dispose()', function () {
      it('should remove all listeners from itself', function () {
        runner.on('disposeShouldRemoveThis', noop);
        runner.dispose();
        expect(runner.listenerCount('disposeShouldRemoveThis'), 'to be', 0);
      });

      it('should remove "error" listeners from a test', function () {
        var fn = sinon.stub();
        runner.test = new Test('test for dispose', fn);
        runner.runTest(noop);
        // sanity check
        expect(runner.test.listenerCount('error'), 'to be', 1);
        runner.dispose();
        expect(runner.test.listenerCount('error'), 'to be', 0);
      });

      it('should remove "uncaughtException" listeners from the process', function () {
        var normalUncaughtExceptionListenerCount =
          process.listenerCount('uncaughtException');
        runner.run(noop);
        // sanity check
        expect(
          process.listenerCount('uncaughtException'),
          'to be',
          normalUncaughtExceptionListenerCount + 1
        );
        runner.dispose();
        expect(
          process.listenerCount('uncaughtException'),
          'to be',
          normalUncaughtExceptionListenerCount
        );
      });
    });

    describe('runTest()', function () {
      it('should return when no tests to run', function () {
        runner.test = undefined;
        expect(runner.runTest(noop), 'to be undefined');
      });
    });

    describe('allowUncaught()', function () {
      it('should allow unhandled errors to propagate through', function () {
        var newRunner = new Runner(suite);
        newRunner.allowUncaught = true;
        newRunner.test = new Test('failing test', function () {
          throw new Error('allow unhandled errors');
        });
        function fail() {
          newRunner.runTest();
        }
        expect(fail, 'to throw', 'allow unhandled errors');
      });

      it('should not allow unhandled errors in sync hooks to propagate through', function (done) {
        suite.beforeEach(function () {
          throw new Error();
        });
        var runner = new Runner(suite);
        runner.allowUncaught = false;

        // We are monkey patching here with runner.once and a hook.run wrapper to effectively
        // capture thrown errors within the event loop phase where Runner.immediately executes
        runner.once(EVENT_HOOK_BEGIN, function (hook) {
          var _run = hook.run;
          hook.run = function (fn) {
            function throwError() {
              _run.call(hook, fn);
            }
            expect(throwError, 'not to throw');
            done();
          };
        });

        runner.hook('beforeEach', noop);
      });

      it('should allow unhandled errors in sync hooks to propagate through', function (done) {
        suite.beforeEach(function () {
          throw new Error('allow unhandled errors in sync hooks');
        });
        var runner = new Runner(suite);
        runner.allowUncaught = true;

        runner.once(EVENT_HOOK_BEGIN, function (hook) {
          var _run = hook.run;
          hook.run = function (fn) {
            function throwError() {
              _run.call(hook, fn);
            }
            var expected = 'allow unhandled errors in sync hooks';
            expect(throwError, 'to throw', expected);
            done();
          };
        });

        runner.hook('beforeEach', noop);
      });

      it('async - should allow unhandled errors in hooks to propagate through', function (done) {
        // the `done` argument, although unused, it triggers the async path
        // see this.async in the Runnable constructor
        suite.beforeEach(function () {
          throw new Error('allow unhandled errors in async hooks');
        });
        var runner = new Runner(suite);
        runner.allowUncaught = true;

        runner.once(EVENT_HOOK_BEGIN, function (hook) {
          var _run = hook.run;
          hook.run = function (fn) {
            function throwError() {
              _run.call(hook, fn);
            }
            var expected = 'allow unhandled errors in async hooks';
            expect(throwError, 'to throw', expected);
            done();
          };
        });

        runner.hook('beforeEach', noop);
      });
    });

    describe('abort()', function () {
      it('should set _abort property to true', function () {
        runner.abort();
        expect(runner._abort, 'to be true');
      });

      it('should return the Runner', function () {
        expect(runner.abort(), 'to be', runner);
      });
    });

    describe('_uncaught()', function () {
      describe('when called with a non-Runner context', function () {
        it('should throw', function () {
          expect(runner._uncaught.bind({}), 'to throw', {
            code: FATAL
          });
        });
      });
    });

    describe('uncaught()', function () {
      beforeEach(function () {
        sinon.stub(runner, 'fail');
      });

      describe('when allow-uncaught is set to true', function () {
        it('should propagate error and throw', function () {
          if (process.browser) this.skip();

          var err = new Error('should rethrow err');
          runner.allowUncaught = true;
          expect(
            function () {
              runner.uncaught(err);
            },
            'to throw',
            'should rethrow err'
          );
        });
      });

      describe('when provided an object argument', function () {
        describe('when argument is not an Error', function () {
          var err;
          beforeEach(function () {
            err = {whatever: 'yolo'};
          });

          it('should fail with a transient Runnable and a new Error coerced from the object', function () {
            runner.uncaught(err);

            expect(runner.fail, 'to have all calls satisfying', [
              expect.it('to be a', Runnable).and('to satisfy', {
                parent: runner.suite,
                title: /uncaught error outside test suite/i
              }),
              expect.it('to be an', Error).and('to satisfy', {
                message: /throw an error/i,
                uncaught: true
              })
            ]).and('was called once');
          });
        });

        describe('when argument is a Pending', function () {
          it('should ignore argument and return', function () {
            var err = new Pending();
            expect(runner.uncaught(err), 'to be undefined');
          });
        });

        describe('when argument is an Error', function () {
          var err;
          beforeEach(function () {
            err = new Error('sorry dave');
          });

          it('should add the "uncaught" property to the Error', function () {
            runner.uncaught(err);
            expect(err, 'to have property', 'uncaught', true);
          });

          describe('when no Runnables are running', function () {
            beforeEach(function () {
              delete runner.currentRunnable;
            });

            it('should fail with a transient Runnable and the error', function () {
              runner.uncaught(err);

              expect(runner.fail, 'to have all calls satisfying', [
                expect.it('to be a', Runnable).and('to satisfy', {
                  parent: runner.suite,
                  title: /uncaught error outside test suite/i
                }),
                err
              ]).and('was called once');
            });

            describe('when Runner is RUNNING', function () {
              beforeEach(function () {
                runner.state = STATE_RUNNING;
              });

              it('should not emit start/end events', function () {
                expect(
                  function () {
                    runner.uncaught(err);
                  },
                  'not to emit from',
                  runner,
                  'start'
                ).and('not to emit from', runner, 'end');
              });
            });

            describe('when Runner is IDLE', function () {
              beforeEach(function () {
                runner.state = STATE_IDLE;
              });

              it('should emit start/end events for the benefit of reporters', function () {
                expect(
                  function () {
                    runner.uncaught(err);
                  },
                  'to emit from',
                  runner,
                  'start'
                ).and('to emit from', runner, 'end');
              });
            });

            describe('when Runner is STOPPED', function () {
              beforeEach(function () {
                runner.state = STATE_STOPPED;
              });

              it('should not emit start/end events, since this presumably would have already happened', function () {
                expect(
                  function () {
                    try {
                      runner.uncaught(err);
                    } catch {}
                  },
                  'not to emit from',
                  runner,
                  'start'
                ).and('not to emit from', runner, 'end');
              });

              it('should throw', function () {
                expect(function () {
                  runner.uncaught(err);
                }, 'to throw');
              });
            });
          });

          describe('when a Runnable is running or has run', function () {
            var runnable;
            beforeEach(function () {
              runnable = new Runnable();
              runnable.parent = runner.suite;
              sinon.stub(runnable, 'clearTimeout');
              runner.currentRunnable = runnable;
            });

            it('should clear any pending timeouts', function () {
              runnable.callback = sinon.fake();
              runner.uncaught(err);
              expect(runnable.clearTimeout, 'was called times', 1);
            });

            describe('when current Runnable has already failed', function () {
              beforeEach(function () {
                sinon.stub(runnable, 'isFailed').returns(true);
              });

              it('should not attempt to fail again', function () {
                runner.uncaught(err);
                expect(runner.fail, 'was not called');
              });
            });

            describe('when current Runnable has been marked pending', function () {
              beforeEach(function () {
                sinon.stub(runnable, 'isPending').returns(true);
              });

              it('should attempt to fail', function () {
                runner.uncaught(err);
                expect(runner.fail, 'was called once');
              });
            });

            describe('when the current Runnable has already passed', function () {
              beforeEach(function () {
                sinon.stub(runnable, 'isPassed').returns(true);
              });

              it('should fail with the current Runnable and the error', function () {
                runner.uncaught(err);

                expect(runner.fail, 'to have all calls satisfying', [
                  expect.it('to be', runnable),
                  err
                ]).and('was called once');
              });

              it('should abort the runner without emitting end event', function () {
                expect(
                  function () {
                    runner.uncaught(err);
                  },
                  'not to emit from',
                  runner,
                  'end'
                );
                expect(runner._abort, 'to be', true);
              });
            });

            describe('when the current Runnable is still running', function () {
              describe('when the current Runnable is a Test', function () {
                beforeEach(function () {
                  runnable = new Test('goomba', noop);
                  runnable.parent = runner.suite;
                  runner.currentRunnable = runnable;
                  runnable.callback = sinon.fake();
                });

                it('should run callback(err) to handle failing and hooks', function () {
                  runner.uncaught(err);

                  expect(runner.fail, 'was not called');
                  expect(runnable.callback, 'to have all calls satisfying', [
                    err
                  ]).and('was called once');
                });

                it('should not notify test has ended', function () {
                  expect(
                    function () {
                      runner.uncaught(err);
                    },
                    'not to emit from',
                    runner,
                    EVENT_TEST_END
                  );
                });

                it('should not notify run has ended', function () {
                  expect(
                    function () {
                      runner.uncaught(err);
                    },
                    'not to emit from',
                    runner,
                    EVENT_RUN_END
                  );
                });
              });

              describe('when the current Runnable is a Hook', function () {
                beforeEach(function () {
                  runnable = new Hook();
                  runnable.parent = runner.suite;
                  runner.currentRunnable = runnable;
                  runnable.callback = sinon.fake();
                });

                it('should run callback(err) to handle failing hook pattern', function () {
                  runner.uncaught(err);

                  expect(runner.fail, 'was not called');
                  expect(runnable.callback, 'to have all calls satisfying', [
                    err
                  ]).and('was called once');
                });

                it('should not notify test has ended', function () {
                  expect(
                    function () {
                      runner.uncaught(err);
                    },
                    'not to emit from',
                    runner,
                    EVENT_TEST_END
                  );
                });

                it('should not notify run has ended', function () {
                  expect(
                    function () {
                      runner.uncaught(err);
                    },
                    'not to emit from',
                    runner,
                    EVENT_RUN_END
                  );
                });
              });
            });
          });
        });
      });
    });

    describe('linkPartialObjects()', function () {
      it('should return the Runner', function () {
        expect(runner.linkPartialObjects(), 'to be', runner);
      });
    });

    describe('isParallelMode()', function () {
      it('should return false', function () {
        expect(runner.isParallelMode(), 'to be false');
      });
    });

    describe('workerReporter()', function () {
      it('should throw', function () {
        expect(() => runner.workerReporter(), 'to throw', {code: UNSUPPORTED});
      });
    });
  });
});
