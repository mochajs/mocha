'use strict';

describe('skip in beforeEach', function () {
  beforeEach(function () {
    this.skip();
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });
});
