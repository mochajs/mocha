describe('fail the test from the "after each" hook', function() {
  it('should fail', function() {
    // but not here
  });

  afterEach(function() {
    this.test.error(new Error('failing from after each'));
  });
});
