'use strict';

describe('skip in test with reason', function () {
  it('should skip async with reason', function (done) {
    var self = this;
    setTimeout(function () {
      self.skip('skip reason');
    }, 50);
  });

  it('should run other tests in the suite', function () {
    // Do nothing
  });
});
