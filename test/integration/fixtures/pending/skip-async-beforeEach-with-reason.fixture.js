'use strict';

describe('skip in beforeEach with reason', function () {
  beforeEach(function (done) {
    var self = this;
    setTimeout(function () {
      self.skip('skip reason');
    }, 50);
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });

  it('should never run this test', function () {
    throw new Error('never thrown');
  });
});
