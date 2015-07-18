describe('asyncOnly', function(){
  it('should display an error', function(){

  })

  it('should pass', function(done){
    done();
  })

  it('should ignore pending tests')

  it('should fail when test throws an error', function(){
    // the async warning only applies if the test would have otherwise passed
    throw Error('you should see this error');
  })

  describe('with a function that returns a promise', function() {
    it('should pass', function(){
      var fulfilledPromise = {
        then: function (fulfilled, rejected) {
          process.nextTick(fulfilled);
        }
      };

      return fulfilledPromise;
    })
  })
})
