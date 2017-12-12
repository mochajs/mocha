'use strict';

var mocha = require('../../lib/mocha');
var Suite = mocha.Suite;
var Runner = mocha.Runner;
var Test = mocha.Test;
var Hook = mocha.Hook;
var path = require('path');
var noop = mocha.utils.noop;

describe('Runner', function () {
  var suite;
  var runner;

  beforeEach(function () {
    suite = new Suite('Suite', 'root');
    runner = new Runner(suite);
  });

  describe('.grep()', function () {
    it('should update the runner.total with number of matched tests', function () {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      var newRunner = new Runner(suite);
      newRunner.grep(/lions/);
      expect(newRunner.total).to.equal(2);
    });

    it('should update the runner.total with number of matched tests when inverted', function () {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      var newRunner = new Runner(suite);
      newRunner.grep(/lions/, true);
      expect(newRunner.total).to.equal(1);
    });
  });

  describe('.grepTotal()', function () {
    it('should return the total number of matched tests', function () {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      runner.grep(/lions/);
      expect(runner.grepTotal(suite)).to.equal(2);
    });

    it('should return the total number of matched tests when inverted', function () {
      suite.addTest(new Test('im a test about lions', noop));
      suite.addTest(new Test('im another test about lions', noop));
      suite.addTest(new Test('im a test about bears', noop));
      runner.grep(/lions/, true);
      expect(runner.grepTotal(suite)).to.equal(1);
    });
  });

  describe('.globalProps()', function () {
    it('should include common non enumerable globals', function () {
      var props = runner.globalProps();
      expect(props).to.contain('setTimeout');
      expect(props).to.contain('clearTimeout');
      expect(props).to.contain('setInterval');
      expect(props).to.contain('clearInterval');
      expect(props).to.contain('Date');
      expect(props).to.contain('XMLHttpRequest');
    });
  });

  describe('.globals()', function () {
    it('should default to the known globals', function () {
      expect(runner.globals().length).to.be.above(16);
    });

    it('should white-list globals', function () {
      runner.globals(['foo', 'bar']);
      expect(runner.globals()).to.contain('foo');
      expect(runner.globals()).to.contain('bar');
    });
  });

  describe('.checkGlobals(test)', function () {
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
      runner.on('fail', function (_test, err) {
        expect(_test).to.equal(test);
        expect(err.message).to.equal('global leak detected: foo');
        delete global.foo;
        done();
      });
      runner.checkGlobals(test);
    });

    it('should emit "fail" when a single new disallowed global is introduced after a single extra global is allowed', function (done) {
      var doneCalled = false;
      runner.globals('good');
      global.bad = 1;
      runner.on('fail', function () {
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
      expect(global.propertyIsEnumerable('XMLHttpRequest')).to.not.be.ok();

      // create a new runner and keep a reference to the test.
      var test = new Test('im a test about bears', noop);
      suite.addTest(test);
      var newRunner = new Runner(suite);

      // make the prop enumerable again.
      global.XMLHttpRequest = function () {};
      expect(global.propertyIsEnumerable('XMLHttpRequest')).to.be.ok();

      // verify the test hasn't failed.
      newRunner.checkGlobals(test);
      expect(test).to.not.have.key('state');

      // clean up our global space.
      delete global.XMLHttpRequest;
    });

    it('should pluralize the error message when several are introduced', function (done) {
      var test = new Test('im a test', noop);
      runner.checkGlobals();
      global.foo = 'bar';
      global.bar = 'baz';
      runner.on('fail', function (_test, err) {
        expect(_test).to.equal(test);
        expect(err.message).to.equal('global leaks detected: foo, bar');
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
      expect(test).to.not.have.key('state');

      delete global.foo;
    });

    it('should respect per test whitelisted globals but still detect other leaks', function (done) {
      var test = new Test('im a test about lions', noop);
      test.globals(['foo']);

      suite.addTest(test);

      global.foo = 'bar';
      global.bar = 'baz';
      runner.on('fail', function (test, err) {
        expect(test.title).to.equal('im a test about lions');
        expect(err.message).to.equal('global leak detected: bar');
        delete global.foo;
        done();
      });
      runner.checkGlobals(test);
    });

    it('should emit "fail" when a global beginning with d is introduced', function (done) {
      global.derp = 'bar';
      runner.on('fail', function () {
        delete global.derp;
        done();
      });
      runner.checkGlobals(new Test('herp', function () {}));
    });
  });

  describe('.hook(name, fn)', function () {
    it('should execute hooks after failed test if suite bail is true', function (done) {
      runner.fail(new Test('failed test', noop));
      suite.bail(true);
      suite.afterEach(function () {
        suite.afterAll(function () {
          done();
        });
      });
      runner.hook('afterEach', function () {});
      runner.hook('afterAll', function () {});
    });
  });

  describe('.fail(test, err)', function () {
    it('should increment .failures', function () {
      expect(runner.failures).to.equal(0);
      runner.fail(new Test('one', noop), {});
      expect(runner.failures).to.equal(1);
      runner.fail(new Test('two', noop), {});
      expect(runner.failures).to.equal(2);
    });

    it('should set test.state to "failed"', function () {
      var test = new Test('some test', noop);
      runner.fail(test, 'some error');
      expect(test.state).to.equal('failed');
    });

    it('should emit "fail"', function (done) {
      var test = new Test('some other test', noop);
      var err = {};
      runner.on('fail', function (test, err) {
        expect(test).to.equal(test);
        expect(err).to.equal(err);
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a helpful message when failed with a string', function (done) {
      var test = new Test('helpful test', noop);
      var err = 'string';
      runner.on('fail', function (test, err) {
        expect(err.message).to.equal('the string "string" was thrown, throw an Error :)');
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a the error when failed with an Error instance', function (done) {
      var test = new Test('a test', noop);
      var err = new Error('an error message');
      runner.on('fail', function (test, err) {
        expect(err.message).to.equal('an error message');
        done();
      });
      runner.fail(test, err);
    });

    it('should emit the error when failed with an Error-like object', function (done) {
      var test = new Test('a test', noop);
      var err = { message: 'an error message' };
      runner.on('fail', function (test, err) {
        expect(err.message).to.equal('an error message');
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a helpful message when failed with an Object', function (done) {
      var test = new Test('a test', noop);
      var err = { x: 1 };
      runner.on('fail', function (test, err) {
        expect(err.message).to.equal('the object {\n  "x": 1\n} was thrown, throw an Error :)');
        done();
      });
      runner.fail(test, err);
    });

    it('should emit a helpful message when failed with an Array', function (done) {
      var test = new Test('a test', noop);
      var err = [
        1,
        2
      ];
      runner.on('fail', function (test, err) {
        expect(err.message).to.equal('the array [\n  1\n  2\n] was thrown, throw an Error :)');
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

      runner.on('fail', function (test, err) {
        expect(err.message).to.equal('not evil');
        done();
      });

      runner.fail(test, err);
    });
  });

  describe('.failHook(hook, err)', function () {
    it('should increment .failures', function () {
      expect(runner.failures).to.equal(0);
      runner.failHook(new Test('fail hook 1', noop), {});
      expect(runner.failures).to.equal(1);
      runner.failHook(new Test('fail hook 2', noop), {});
      expect(runner.failures).to.equal(2);
    });

    it('should augment hook title with current test title', function () {
      var hook = new Hook('"before each" hook');
      hook.ctx = { currentTest: new Test('should behave', noop) };

      runner.failHook(hook, {});
      expect(hook.title).to.equal('"before each" hook for "should behave"');

      hook.ctx.currentTest = new Test('should obey', noop);
      runner.failHook(hook, {});
      expect(hook.title).to.equal('"before each" hook for "should obey"');
    });

    it('should emit "fail"', function (done) {
      var hook = new Hook();
      var err = {};
      runner.on('fail', function (hook, err) {
        expect(hook).to.equal(hook);
        expect(err).to.equal(err);
        done();
      });
      runner.failHook(hook, err);
    });

    it('should emit "end" if suite bail is true', function (done) {
      var hook = new Hook();
      var err = {};
      suite.bail(true);
      runner.on('end', done);
      runner.failHook(hook, err);
    });

    it('should not emit "end" if suite bail is not true', function (done) {
      var hook = new Hook();
      var err = {};
      suite.bail(false);
      runner.on('end', function () {
        throw new Error('"end" was emit, but the bail is false');
      });
      runner.failHook(hook, err);
      done();
    });
  });

  describe('allowUncaught', function () {
    it('should allow unhandled errors to propagate through', function (done) {
      var newRunner = new Runner(suite);
      newRunner.allowUncaught = true;
      newRunner.test = new Test('failing test', function () {
        throw new Error('allow unhandled errors');
      });
      function fail () {
        newRunner.runTest();
      }
      expect(fail).to.throwError('allow unhandled errors');
      done();
    });
  });

  describe('stackTrace', function () {
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

    describe('shortStackTrace', function () {
      beforeEach(function () {
        if (path.sep !== '/') {
          this.skip();
        }
      });

      it('should prettify the stack-trace', function (done) {
        var hook = new Hook();
        var err = new Error();
        // Fake stack-trace
        err.stack = stack.join('\n');

        runner.on('fail', function (hook, err) {
          expect(err.stack).to.equal(stack.slice(0, 3).join('\n'));
          done();
        });
        runner.failHook(hook, err);
      });
    });

    describe('longStackTrace', function () {
      beforeEach(function () {
        if (path.sep !== '/') {
          this.skip();
        }
      });

      it('should display the full stack-trace', function (done) {
        var hook = new Hook();
        var err = new Error();
        // Fake stack-trace
        err.stack = stack.join('\n');
        // Add --stack-trace option
        runner.fullStackTrace = true;

        runner.on('fail', function (hook, err) {
          expect(err.stack).to.equal(stack.join('\n'));
          done();
        });
        runner.failHook(hook, err);
      });
    });
  });
});
