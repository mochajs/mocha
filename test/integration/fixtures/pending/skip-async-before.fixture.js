describe('skip in before', function() {
  before(function(done) {
    var self = this;
    setTimeout(function() {
      self.skip();
    }, 50);
  });

  it('should never run this test', function() {
    throw new Error('never thrown');
  });

  it('should never run this test', function() {
    throw new Error('never thrown');
  });
});
