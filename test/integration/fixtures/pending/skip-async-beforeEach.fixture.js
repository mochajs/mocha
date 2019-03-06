'use strict';

describe('skip in beforeEach', function () {
  beforeEach(function (done) {
    var self = this;
    setTimeout(function () {
      self.skip();   // done() is not required
    }, 0);
  });

  it('should skip this test-1', function () {
    throw new Error('never run this test');
  });
  it('should skip this test-2', function () {
    throw new Error('never run this test');
  });
  it('should skip this test-3', function () {
    throw new Error('never run this test');
  });
});
