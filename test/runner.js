
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

  describe('.globals()', function(){
    it('should default to the known globals', function(){
      runner.globals().length.should.be.above(10);
    })

    it('should white-list globals', function(){
      runner.globals(['foo', 'bar']);
      runner.globals().should.include('foo');
      runner.globals().should.include('bar');
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
  })

  describe('.failHook(hoot, err)', function(){
    it('should increment .failures', function(){
      runner.failures.should.equal(0);
      runner.failHook({}, {});
      runner.failures.should.equal(1);
      runner.failHook({}, {});
      runner.failures.should.equal(2);
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

    it('should emit "end"', function(done){
      var hook = {}, err = {};
      runner.on('end', done);
      runner.failHook(hook, err);
    })
  })
})
