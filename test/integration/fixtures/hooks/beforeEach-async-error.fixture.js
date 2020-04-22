'use strict';

describe('spec 1', function() {
  beforeEach(function(done) {
    process.nextTick(function() {
      throw new Error('before each hook error');
    });
  });
  it('should not run test-1', function() { });
  it('should not run test-2', function() { });
});

describe('spec 2', function() {
  it('should run test-3', function() { });
});
