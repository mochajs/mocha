'use strict';

describe('skip conditionally in beforeEach', function() {
  var n = 1;
  beforeEach(function() {
    if (n !== 2) {
        this.skip();
    }
  });

  it('should skip this test-1', function() {
    throw new Error('never run this test');
  });
  it('should run this test-2', function() {});

  describe('inner suite', function() {
    it('should skip this test-3', function() {
      throw new Error('never run this test');
    });
  });

  afterEach(function() { n++; });
  after(function() {
    if (n === 4) {
      throw new Error('should throw this error');
    }
  });
});
