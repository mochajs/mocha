describe('Multiple runs', () => {

  /**
   * Shared state! Bad practice, but nice for this test
   */
  let i = 0;

  it('should skip, fail and pass respectively', function () {
    switch (i++) {
      case 0:
        this.skip();
      case 1:
        throw new Error('Expected error');
      default:
        // this is fine ☕
        break;
    }
  });
});
