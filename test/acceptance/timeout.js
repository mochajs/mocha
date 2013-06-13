
describe('timeouts', function(){

  it('should allow overriding per-test', function(done){
    this.timeout(1000);
    setTimeout(function(){
      done();
    }, 300);
  })

})
