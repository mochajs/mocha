'use strict';

describe('outer describe', function () {
  it('should run this test', function () {});

  describe('skip in before', function () {
    before(function (done) {
      var self = this;
      setTimeout(function () {
        self.skip();
      }, 0);
    });

    it('should never run this test', function () {
      throw new Error('never run this test');
    });
    it('should never run this test', function () {
      throw new Error('never run this test');
    });
  });

  it('should run this test', function () {});
});
