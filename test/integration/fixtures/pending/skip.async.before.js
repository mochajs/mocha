describe('skip in asynchronous before', function() {
  before(function(done){
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
