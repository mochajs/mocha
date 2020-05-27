describe('leak detection', function() {
  function testMe() {
    x = 123; // leak variable
  }

  it('should not leak', function(done) {
    testMe();
    done(); // just pass
  });

  before(function() {});

  after(function() {});
});
