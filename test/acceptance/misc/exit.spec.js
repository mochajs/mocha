describe('exit', function(){
  //note --bail works nicely in that it still allows an 'early exit' in an error scenario
  it('should not exit even in error scenario if called with --no-exit', function(done){
    done(new Error('failure'));
  })

  it('should take a long time to exit if called with --no-exit', function(done){
    done();
    setTimeout(function() {
      console.log('all done');
    }, 2500)
  })

  it('should kill all processes when SIGINT received', function () {
    // uncomment to test
    //while (true) {}
  });
})
