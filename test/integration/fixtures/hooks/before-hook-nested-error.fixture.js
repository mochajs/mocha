'use strict';

describe('spec 1', function () {
  it('should run test-1', function () { });
  describe('spec nested', function () {
    before(function() {
      throw new Error('before hook nested error');
    });
    it('should not run nested test-2', function () { });
  });
});
