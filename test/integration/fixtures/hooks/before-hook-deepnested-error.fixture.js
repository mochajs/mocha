'use strict';

describe('spec 1', function () {
  it('should run test-1', function () { });
  describe('nested spec 2', function () {
    before(function() {
      throw new Error('before hook nested error');
    });
    describe('deepnested spec 3', function () { 
      it('should not run deepnested test-2', function () { });
    });
  });
});
