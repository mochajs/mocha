describe('skip in asynchronous test', function() {
  it('should skip when called from a test', function(done) {
    var test = this;
    setTimeout(function() {
      test.skip();
      throw new Error('never thrown');
    }, 0);
  });

  it('should run other tests in the suite', function() {});
});
