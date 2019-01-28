'use strict';

describe('spec 1', function () {
  it('should pass', function () { });
  describe('spec nested', function () {
    before(function() {
      throw new Error('before hook nested error');
    });
    it('it nested - this title should be used', function () { });
  });
});
