
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
})

