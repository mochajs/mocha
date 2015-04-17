var mocha = require('../')
  , Suite = mocha.Suite
  , Runner = mocha.Runner
  , Test = mocha.Test;

describe('Runner', function(){
  var suite, runner;

  beforeEach(function(){
    suite = new Suite(null, 'root');
    runner = new Runner(suite);
  })

  describe('.grep()', function(){
    it('should update the runner.total with number of matched tests', function(){
      suite.addTest(new Test('im a test about lions'));
      suite.addTest(new Test('im another test about lions'));
      suite.addTest(new Test('im a test about bears'));
      var newRunner = new Runner(suite);
      newRunner.grep(/lions/);
      newRunner.total.should.equal(2);
    })

    it('should update the runner.total with number of matched tests when inverted', function(){
      suite.addTest(new Test('im a test about lions'));
      suite.addTest(new Test('im another test about lions'));
      suite.addTest(new Test('im a test about bears'));
      var newRunner = new Runner(suite);
      newRunner.grep(/lions/, true);
      newRunner.total.should.equal(1);
    })
  })

  describe('.grepTotal()', function(){
    it('should return the total number of matched tests', function(){
      suite.addTest(new Test('im a test about lions'));
      suite.addTest(new Test('im another test about lions'));
      suite.addTest(new Test('im a test about bears'));
      runner.grep(/lions/);
      runner.grepTotal(suite).should.equal(2);
    })

    it('should return the total number of matched tests when inverted', function(){
      suite.addTest(new Test('im a test about lions'));
      suite.addTest(new Test('im another test about lions'));
      suite.addTest(new Test('im a test about bears'));
      runner.grep(/lions/, true);
      runner.grepTotal(suite).should.equal(1);
    })
  })

  describe('.globalProps()', function(){
    it('should include common non enumerable globals', function() {
      var props = runner.globalProps();
      props.should.containEql('setTimeout');
      props.should.containEql('clearTimeout');
      props.should.containEql('setInterval');
      props.should.containEql('clearInterval');
      props.should.containEql('Date');
      props.should.containEql('XMLHttpRequest');
    });
  });

  describe('.globals()', function(){
    it('should default to the known globals', function(){
      runner.globals().length.should.be.above(16);
    })

    it('should white-list globals', function(){
      runner.globals(['foo', 'bar']);
      runner.globals().should.containEql('foo');
      runner.globals().should.containEql('bar');
    })
  })

  describe('.checkGlobals(test)', function(){
    it('should allow variables that match a wildcard', function(done) {
      runner.globals(['foo*', 'giz*']);
      global.foo = 'baz';
      global.gizmo = 'quux';
      runner.checkGlobals();
      delete global.foo;
      delete global.gizmo;
      done()
    })

    it('should emit "fail" when a new global is introduced', function(done){
      runner.checkGlobals();
      global.foo = 'bar';
      runner.on('fail', function(test, err){
        test.should.equal('im a test');
        err.message.should.equal('global leak detected: foo');
        delete global.foo;
        done();
      });
      runner.checkGlobals('im a test');
    })

    it('should emit "fail" when a single new disallowed global is introduced after a single extra global is allowed', function(done) {
      var doneCalled = false;
      runner.globals('good');
      global.bad = 1;
      runner.on('fail', function(test, err) {
        delete global.bad;
        done();
        doneCalled = true;
      });
      runner.checkGlobals('test');
      if (!doneCalled) {
        done(Error("Expected test failure did not occur."));
      }
    });

    it ('should not fail when a new common global is introduced', function(){
      // verify that the prop isn't enumerable
      delete global.XMLHttpRequest;
      global.propertyIsEnumerable('XMLHttpRequest').should.not.be.ok;

      // create a new runner and keep a reference to the test.
      var test = new Test('im a test about bears');
      suite.addTest(test);
      var newRunner = new Runner(suite);

      // make the prop enumerable again.
      global.XMLHttpRequest = function() {};
      global.propertyIsEnumerable('XMLHttpRequest').should.be.ok;

      // verify the test hasn't failed.
      newRunner.checkGlobals(test);
      test.should.not.have.key('state');

      // clean up our global space.
      delete global.XMLHttpRequest;
    });

    it('should pluralize the error message when several are introduced', function(done){
      runner.checkGlobals();
      global.foo = 'bar';
      global.bar = 'baz';
      runner.on('fail', function(test, err){
        test.should.equal('im a test');
        err.message.should.equal('global leaks detected: foo, bar');
        delete global.foo;
        delete global.bar;
        done();
      });
      runner.checkGlobals('im a test');
    })

    it('should respect per test whitelisted globals', function() {
      var test = new Test('im a test about lions');
      test.globals(['foo']);

      suite.addTest(test);
      var runner = new Runner(suite);

      global.foo = 'bar';

      // verify the test hasn't failed.
      runner.checkGlobals(test);
      test.should.not.have.key('state');

      delete global.foo;
    })

    it('should respect per test whitelisted globals but still detect other leaks', function(done) {
      var test = new Test('im a test about lions');
      test.globals(['foo']);

      suite.addTest(test);

      global.foo = 'bar';
      global.bar = 'baz';
      runner.on('fail', function(test, err){
        test.title.should.equal('im a test about lions');
        err.message.should.equal('global leak detected: bar');
        delete global.foo;
        done();
      });
      runner.checkGlobals(test);
    })
  })

  describe('.hook(name, fn)', function(){
    it('should execute hooks after failed test if suite bail is true', function(done){
      runner.fail({});
      suite.bail(true);
      suite.afterEach(function(){
        suite.afterAll(function() {
          done();
        })
      });
      runner.hook('afterEach', function(){});
      runner.hook('afterAll', function(){});
    })
  })

  describe('.fail(test, err)', function(){
    it('should increment .failures', function(){
      runner.failures.should.equal(0);
      runner.fail({}, {});
      runner.failures.should.equal(1);
      runner.fail({}, {});
      runner.failures.should.equal(2);
    })

    it('should set test.state to "failed"', function(){
      var test = {};
      runner.fail(test, 'some error');
      test.state.should.equal('failed');
    })

    it('should emit "fail"', function(done){
      var test = {}, err = {};
      runner.on('fail', function(test, err){
        test.should.equal(test);
        err.should.equal(err);
        done();
      });
      runner.fail(test, err);
    })

    it('should emit a helpful message when failed with a string', function(done){
      var test = {}, err = 'string';
      runner.on('fail', function(test, err){
        err.message.should.equal('the string "string" was thrown, throw an Error :)');
        done();
      });
      runner.fail(test, err);
    })

    it('should emit a the error when failed with an Error instance', function(done){
      var test = {}, err = new Error('an error message');
      runner.on('fail', function(test, err){
        err.message.should.equal('an error message');
        done();
      });
      runner.fail(test, err);
    })

    it('should emit the error when failed with an Error-like object', function(done){
      var test = {}, err = {message: 'an error message'};
      runner.on('fail', function(test, err){
        err.message.should.equal('an error message');
        done();
      });
      runner.fail(test, err);
    })

    it('should emit a helpful message when failed with an Object', function(done){
      var test = {}, err = { x: 1 };
      runner.on('fail', function(test, err){
        err.message.should.equal('the object {\n  "x": 1\n} was thrown, throw an Error :)');
        done();
      });
      runner.fail(test, err);
    })

    it('should emit a helpful message when failed with an Array', function(done){
      var test = {}, err = [1,2];
      runner.on('fail', function(test, err){
        err.message.should.equal('the array [\n  1\n  2\n] was thrown, throw an Error :)');
        done();
      });
      runner.fail(test, err);
    })
  })

  describe('.failHook(hook, err)', function(){
    it('should increment .failures', function(){
      runner.failures.should.equal(0);
      runner.failHook({}, {});
      runner.failures.should.equal(1);
      runner.failHook({}, {});
      runner.failures.should.equal(2);
    })

    it('should augment hook title with current test title', function(){
      var hook = {
        title: '"before each" hook',
        ctx: { currentTest: new Test('should behave') }
      };
      runner.failHook(hook, {});
      hook.title.should.equal('"before each" hook for "should behave"');

      hook.ctx.currentTest = new Test('should obey');
      runner.failHook(hook, {});
      hook.title.should.equal('"before each" hook for "should obey"');
    })

    it('should emit "fail"', function(done){
      var hook = {}, err = {};
      runner.on('fail', function(hook, err){
        hook.should.equal(hook);
        err.should.equal(err);
        done();
      });
      runner.failHook(hook, err);
    })

    it('should emit "end" if suite bail is true', function(done){
      var hook = {}, err = {};
      suite.bail(true);
      runner.on('end', done);
      runner.failHook(hook, err);
    })

    it('should not emit "end" if suite bail is not true', function(done){
      var hook = {}, err = {};
      suite.bail(false);
      runner.on('end', function() { throw new Error('"end" was emit, but the bail is false'); });
      runner.failHook(hook, err);
      done();
    })
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
      fail.should.throw('allow unhandled errors');
      done();
    });
  });

  describe('stackTrace', function() {
    var stack = [ 'AssertionError: foo bar'
      , 'at EventEmitter.<anonymous> (/usr/local/dev/test.js:16:12)'
      , 'at Context.<anonymous> (/usr/local/dev/test.js:19:5)'
      , 'Test.Runnable.run (/usr/local/lib/node_modules/mocha/lib/runnable.js:244:7)'
      , 'Runner.runTest (/usr/local/lib/node_modules/mocha/lib/runner.js:374:10)'
      , '/usr/local/lib/node_modules/mocha/lib/runner.js:452:12'
      , 'next (/usr/local/lib/node_modules/mocha/lib/runner.js:299:14)'
      , '/usr/local/lib/node_modules/mocha/lib/runner.js:309:7'
      , 'next (/usr/local/lib/node_modules/mocha/lib/runner.js:248:23)'
      , 'Immediate._onImmediate (/usr/local/lib/node_modules/mocha/lib/runner.js:276:5)'
      , 'at processImmediate [as _immediateCallback] (timers.js:321:17)'];

    describe('shortStackTrace', function() {
      it('should prettify the stack-trace', function(done) {
        var hook = {},
            err = new Error();
        // Fake stack-trace
        err.stack = stack.join('\n');

        runner.on('fail', function(hook, err){
          err.stack.should.equal(stack.slice(0,3).join('\n'));
          done();
        });
        runner.failHook(hook, err);
      });
    });

    describe('longStackTrace', function() {
      it('should display the full stack-trace', function(done) {
        var hook = {},
            err = new Error();
        // Fake stack-trace
        err.stack = stack.join('\n');
        // Add --stack-trace option
        runner.fullStackTrace = true;

        runner.on('fail', function(hook, err){
          err.stack.should.equal(stack.join('\n'));
          done();
        });
        runner.failHook(hook, err);
      });
    });
  });
});
