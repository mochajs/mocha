'use strict';

describe('skip in beforeEach', function () {
  beforeEach(function (done) {
    var self = this;
    setTimeout(function () {
      self.skip();
      done();
    }, 50);
  });

  it('should skip this test', function () {});
  it('should error before reaching this test', function () {});
  it('should error before reaching this test', function () {});
});
