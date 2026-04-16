'use strict';

describe('timeout 0 silent exit', function () {
  this.timeout(0);

  it('should fail when promise never resolves', function () {
    // Return a promise that never resolves.
    // Without the fix, the process would exit silently with code 0.
    return new Promise(function () {});
  });
});
