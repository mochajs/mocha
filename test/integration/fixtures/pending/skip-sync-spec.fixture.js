'use strict';

describe('skip in test', function () {
  it('should skip immediately', function () {
    this.skip();
    throw new Error('never run this test');
  });

  it('should run other tests in the suite', function () {});
});
