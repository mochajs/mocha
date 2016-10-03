describe('skip in before', function() {
  before(function() {
    this.skip();
  });

  it('should never run this test', function() {
    throw new Error('never thrown');
  });

  it('should never run this test', function() {
    throw new Error('never thrown');
  });
});
