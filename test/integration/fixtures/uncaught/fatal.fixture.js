'use strict';

describe('fatal uncaught exception', function () {
  describe('first suite', function () {
    it('should bail if a successful test asynchronously fails', function (done) {
      done();
      process.nextTick(function () {
        throw new Error('global error');
      });
    });

    it('should not actually get run', function () {
      throw new Error('should never throw - first suite');
    });
  });
  
  describe('second suite', function () {
    it('should not actually get run', function () {
      throw new Error('should never throw - second suite');
    });
  });
});
