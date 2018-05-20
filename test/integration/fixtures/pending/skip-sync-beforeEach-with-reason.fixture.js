'use strict';

describe('skip in beforeEach with reason', function () {
  beforeEach(function () {
    this.skip('skip reason');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });
});
