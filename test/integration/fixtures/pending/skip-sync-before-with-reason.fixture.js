'use strict';

describe('skip in before with reason', function () {
  before(function () {
    this.skip('skip reason');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });
});
