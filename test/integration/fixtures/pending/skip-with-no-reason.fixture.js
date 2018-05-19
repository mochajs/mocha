'use strict';

describe('skip in test with reason', function () {
  it('should skip immediately with reason', function () {
    this.skip();
    throw new Error('never thrown');
  });

  it('should run other tests in the suite', function () {
    // Do nothing
  });
});
