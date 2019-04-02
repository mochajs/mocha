'use strict';

describe('skip in after', function () {
  it('should run this test-1', function () {});

  after('should print DeprecationWarning', function () {
    this.skip();
    throw new Error('never throws this error');
  });

  describe('inner suite', function () {
    it('should run this test-2', function () {});
  });
});

describe('second suite', function () {
  it('should run this test-3', function () {});
});
