'use strict';

describe('fatal uncaught exception', function () {
  describe('first suite', function () {
    it('should continue if a successful test asynchronously fails', function (done) {
      done();
      process.nextTick(function () {
        throw new Error('global error');
      });
    });

    it('should still run after the async failure', function () {});
  });

  describe('second suite', function () {
    it('should also still run', function () {});
  });
});
