describe('uncaught', function() {
  beforeEach(function(done) {
    process.nextTick(function() {
      throw new Error('oh noes');
      done();
    });
  });

  it('test', function(done) {
    process.nextTick(function() {
      throw new Error("I'm uncaught!");
      done();
    });
  });
});
