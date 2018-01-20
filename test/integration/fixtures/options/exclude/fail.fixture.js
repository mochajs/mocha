'use strict';

describe('exclude test fail', function () {
  it('should not run this test', function () {
    throw new Error('should not run');
  });
});
