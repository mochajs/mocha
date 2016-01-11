describe('skip in asynchronous beforeEach', function() {
  beforeEach(function(done){
    var hook = this;
    setTimeout(function() {
      hook.skip();
      throw new Error('never thrown');
    }, 0);
  });

  it('should never run this test', function() {
    throw new Error('never thrown');
  });

  it('should never run this test', function() {
    throw new Error('never thrown');
  });
});
