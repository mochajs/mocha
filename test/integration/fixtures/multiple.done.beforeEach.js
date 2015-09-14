describe('suite', function() {
  beforeEach(function(done) {
    setTimeout(done, 10);
    setTimeout(done, 20);
  });

  it('test1', function(done) {
    setTimeout(done, 50);
  });

  it('test2', function(done) {
    setTimeout(done, 50);
  });
});
