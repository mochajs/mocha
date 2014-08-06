
describe('timeouts', function(){
  beforeEach(function(done){
    // uncomment
    // setTimeout(done, 3000);
    done();
  })

  it('should error on timeout', function(done){
    // uncomment
    // setTimeout(done, 3000);
    done();
  })

  it('should allow overriding per-test', function(done){
    this.timeout(1000);
    setTimeout(function(){
      done();
    }, 300);
  })

  describe('disabling', function(){
    it('should allow overriding per-test', function(done){
      this.enableTimeouts(false);
      this.timeout(1);
      setTimeout(done, 2);
    });
    
    it('should work with timeout(0)', function(done) {
      this.timeout(0);
      setTimeout(done, 1);
    })
  });
  
})
