'use strict';

describe('skip in beforeEach', function () {
  beforeEach(function (done) {
    var self = this;
    setTimeout(function () {
      self.skip();
    }, 50);
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });
});
