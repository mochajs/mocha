'use strict';

describe('per-test allowUncaught', function () {
  it('should bubble out of mocha', function () {
    this.allowUncaught();
    throw new Error('explicit-per-test');
  });
});
