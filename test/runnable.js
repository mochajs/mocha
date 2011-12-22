
var mocha = require('../')
  , Runnable = mocha.Runnable
  , EventEmitter = require('events').EventEmitter;

describe('Runnable(title, fn)', function(){
  describe('#timeout(ms)', function(){
    it('should set the timeout', function(){
      var run = new Runnable;
      run.timeout(1000)
      run.timeout().should.equal(1000);
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