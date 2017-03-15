'use strict';

describe('retries', function () {
  this.retries(3);
  describe('nested', function () {
    it('should fail after only 1 retry', function () {
      this.retries(1);
      throw new Error('retry error');
    });
  });
});
