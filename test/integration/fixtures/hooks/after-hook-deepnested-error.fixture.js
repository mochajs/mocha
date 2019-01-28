'use strict';

describe('spec 1', function () {
  it('should pass', function () { });
  describe('spec 2 nested - this title should be used', function () {
    after(function() {
      throw new Error('after hook nested error');
    });
    describe('spec 3 nested', function () {
        it('it nested - this title should not be used', function () { });
    });
  });
});
