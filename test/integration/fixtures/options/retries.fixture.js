'use strict';

describe('retries', function () {
  it('should fail', function () {
    throw new Error('retry failure');
  });
});
