'use strict';

describe('timeout 0 silent exit', function () {
  this.timeout(0);

  it('should fail when promise never resolves', function () {
    return new Promise(function () {});
  });
});
