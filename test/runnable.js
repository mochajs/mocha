
var mocha = require('../')
  , Runnable = mocha.Runnable
  , EventEmitter = require('events').EventEmitter;

describe('Runnable(title, fn)', function(){
  // For every test we poison the global time-related methods.
  // runnable.js etc. should keep its own local copy, in order to fix GH-237.
  // NB: we can't poison global.Date because the normal implementation of
  // global.setTimeout uses it [1] so if the runnable.js keeps a copy of
  // global.setTimeout (like it's supposed to), that will blow up.
  // [1]: https://github.com/joyent/node/blob/7fc835afe362ebd30a0dbec81d3360bd24525222/lib/timers.js#L74
  var setTimeout = global.setTimeout
    , setInterval = global.setInterval
    , clearTimeout = global.clearTimeout
    , clearInterval = global.clearInterval;

  function poisonPill() {
    throw new Error("Don't use global time-related stuff.");
  }

  beforeEach(function(){
    global.setTimeout =
    global.setInterval =
    global.clearTimeout =
    global.clearInterval = poisonPill;
  })

  afterEach(function(){
    global.setTimeout = setTimeout;
    global.setInterval = setInterval;
    global.clearTimeout = clearTimeout;
    global.clearInterval = clearInterval;
  })

  describe('#timeout(ms)', function(){
    it('should set the timeout', function(){
      var run = new Runnable;
      run.timeout(1000)
      run.timeout().should.equal(1000);
    })
  })

  describe('#slow(ms)', function(){
    it('should set the slow threshold', function(){
      var run = new Runnable;
      run.slow(100)
      run.slow().should.equal(100);
    })
  })

  describe('.title', function(){
    it('should be present', function(){
      new Runnable('foo').title.should.equal('foo');
    })
  })

  describe('when arity >= 1', function(){
    it('should be .async', function(){
      var run = new Runnable('foo', function(done){});
      run.async.should.equal(1);
      run.sync.should.be.false;
    })
  })
  
  describe('when arity == 0', function(){
    it('should be .sync', function(){
      var run = new Runnable('foo', function(){});
      run.async.should.be.equal(0);
      run.sync.should.be.true;
    })
  })

  describe('.run(fn)', function(){
    describe('when .pending', function(){
      it('should not invoke the callback', function(done){
        var test = new Runnable('foo', function(){
          throw new Error('should not be called');
        });

        test.pending = true;
        test.run(done);
      })
    })

    describe('when sync', function(){
      describe('without error', function(){
        it('should invoke the callback', function(done){
          var calls = 0;
          var test = new Runnable('foo', function(){
            ++calls;
          });

          test.run(function(err){
            calls.should.equal(1);
            test.duration.should.be.a('number');
            done(err);
          })
        })
      })

      describe('when an exception is thrown', function(){
        it('should invoke the callback', function(done){
          var calls = 0;
          var test = new Runnable('foo', function(){
            ++calls;
            throw new Error('fail');
          });

          test.run(function(err){
            calls.should.equal(1);
            err.message.should.equal('fail');
            done();
          })
        })
      })
    })

    describe('when async', function(){
      describe('without error', function(){
        it('should invoke the callback', function(done){
          var calls = 0;
          var test = new Runnable('foo', function(done){
            process.nextTick(done);
          });

          test.run(done);
        })
      })

      describe('when the callback is invoked several times', function(){
        describe('without an error', function(){
          it('should emit a single "error" event', function(done){
            var calls = 0;
            var errCalls = 0;

            var test = new Runnable('foo', function(done){
              process.nextTick(done);
              process.nextTick(done);
              process.nextTick(done);
              process.nextTick(done);
            });

            test.on('error', function(err){
              ++errCalls;
              err.message.should.equal('done() called multiple times');
              calls.should.equal(1);
              errCalls.should.equal(1);
              done();
            });

            test.run(function(){
              ++calls;
            });
          })
        })

        describe('with an error', function(){
          it('should emit a single "error" event', function(done){
            var calls = 0;
            var errCalls = 0;

            var test = new Runnable('foo', function(done){
              done(new Error('fail'));
              process.nextTick(done);
              done(new Error('fail'));
              process.nextTick(done);
              process.nextTick(done);
            });

            test.on('error', function(err){
              ++errCalls;
              err.message.should.equal('fail');
              calls.should.equal(1);
              errCalls.should.equal(1);
              done();
            });

            test.run(function(){
              ++calls;
            });
          })
        })
      })

      describe('when an exception is thrown', function(){
        it('should invoke the callback', function(done){
          var calls = 0;
          var test = new Runnable('foo', function(done){
            throw new Error('fail');
            process.nextTick(done);
          });

          test.run(function(err){
            err.message.should.equal('fail');
            done();
          });
        })
      })

      describe('when an error is passed', function(){
        it('should invoke the callback', function(done){
          var calls = 0;
          var test = new Runnable('foo', function(done){
            done(new Error('fail'));
          });

          test.run(function(err){
            err.message.should.equal('fail');
            done();
          });
        })
      })
    })

  })
})
