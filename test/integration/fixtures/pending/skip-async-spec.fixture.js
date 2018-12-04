'use strict';

describe('skip in test', function () {
  it('should skip async', function (done) {
    var self = this;
    setTimeout(function () {
      self.skip();
    }, 0);
  });

  it('should run other tests in the suite', function () {});
});
