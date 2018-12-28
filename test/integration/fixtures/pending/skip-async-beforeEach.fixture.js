'use strict';

describe('skip in beforeEach', function () {
  beforeEach(function (done) {
    var self = this;
    setTimeout(function () {
      self.skip();
      done();
    }, 0);
  });

  it('should skip this test', function () {
    throw new Error('never run this test');
  });
  it('should not reach this test', function () {
    throw new Error('never run this test');
  });
  it('should not reach this test', function () {
    throw new Error('never run this test');
  });
});
