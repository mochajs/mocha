'use strict';

describe('spec 1', function() {
  it('should run test-1', function() { });

  describe('nested spec 2', function() {
    beforeEach(function(done) {
      process.nextTick(function() {
        throw new Error('before each hook error');
      });
    });
    it('should not run nested test-2', function() { });

    describe('deepnested spec 3', function() { 
      it('should not run deepnested test-3', function() { });
    });
  });
});
