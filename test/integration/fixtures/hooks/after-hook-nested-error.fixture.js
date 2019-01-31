'use strict';

describe('spec 1', function () {
  it('should pass', function () { });
  describe('spec nested', function () {
    after(function() {
      throw new Error('after hook nested error');
    });
    it('it nested - this title should be used', function () { });
  });
  describe('spec 2 nested', function () {
    it('it nested - not this title', function () { });
  });
});
