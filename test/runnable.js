
var mocha = require('../')
  , Runnable = mocha.Runnable;

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

      describe('when throwing an exception', function(){
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
  })
})