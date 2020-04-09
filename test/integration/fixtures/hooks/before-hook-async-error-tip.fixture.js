'use strict';

describe('spec 1', function () {
  it('should run test-1', function () { });
});
describe('spec 2', function () {
  before(function (done) {
    process.nextTick(function () {
      throw new Error('before hook error');
    });
  });
  it('should not run test-2', function () { });
});
