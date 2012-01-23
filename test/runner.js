
var mocha = require('../')
  , Suite = mocha.Suite
  , Runner = mocha.Runner;

describe('Runner', function(){
  var suite, runner;

  beforeEach(function(){
    suite = new Suite(null, 'root');
    runner = new Runner(suite);
  })

  describe('.globals()', function(){
    it('should default to the known globals', function(){
      runner.globals().length.should.be.above(10);
    })

    it('should white-list globals', function(){
      runner.globals(['foo', 'bar']);
      runner.globals().should.contain('foo');
      runner.globals().should.contain('bar');
    })
  })

  describe('.checkGlobals(test)', function(){
    it('should emit "fail" when a new global is introduced', function(done){
      runner.checkGlobals();
      foo = 'bar';
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
      foo = 'bar';
      bar = 'baz';
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

    it('should set test.failed to true', function(){
      var test = {};
      runner.fail(test, 'some error');
      test.failed.should.be.true;
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
