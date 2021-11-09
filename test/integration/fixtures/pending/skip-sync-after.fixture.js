'use strict';

describe('skip in after', function () {
  it('should run this test-1', function () {});

  after('should throw "this.skip forbidden"', function () {
    this.skip();
  });

  describe('inner suite', function () {
    it('should run this test-2', function () {});
  });
});

describe('second suite', function () {
  it('should run this test-3', function () {});
});
