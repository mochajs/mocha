describe('Multiple runs', () => {

  /**
   * Shared state! Bad practice, but nice for this test
   */
  let i = 0;

  beforeEach(function () {
    if (i++ === 0) {
      throw new Error('Expected error for this test');
    }
  });


  it('should be a dummy test', function () {
    // this is fine ☕
  });
});
