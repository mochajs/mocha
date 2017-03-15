'use strict';

describe('issue-2315: cannot read property currentRetry of undefined', function () {
  before(function () {
    process.nextTick(function () {
      throw new Error();
    });
  });

  it('something', function () {});
});
