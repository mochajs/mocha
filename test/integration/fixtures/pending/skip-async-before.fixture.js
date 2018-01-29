'use strict';

describe('outer describe', function () {

  it('should run this test', function () {});

  describe('skip in before', function () {
    before(function (done) {
      var self = this;
      setTimeout(function () {
        self.skip();
      }, 50);
    });

    it('should never run this test', function () {});
    it('should never run this test', function () {});
  });

  it('should run this test', function () {});

});
