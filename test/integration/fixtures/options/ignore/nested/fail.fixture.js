'use strict';

describe('ignore test nested fail', function () {
  it('should not run this test', function () {
    throw new Error('should not run');
  });
});
