'use strict';

describe('retries', function () {
  this.retries(1);
  var times = 0;

  it('should pass after 1 retry', function () {
    times++;
    if (times !== 2) {
      throw new Error('retry error ' + times);
    }
  });
});
