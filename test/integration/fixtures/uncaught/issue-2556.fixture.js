'use strict';
// first, i could not think of a better file name. :(
// reproduces #2556: uncaught exception from a completed test should
// bail and not run any further tests.

describe('first suite', function () {
  it('should pass then trigger async error', function (done) {
    done();
    process.nextTick(function () {
      throw new Error('async error from first suite');
    });
  });

  it('should not be reached - first suite', function () {
    throw new Error('should never throw - first suite');
  });
});

describe('second suite', function () {
  it('should not be reached - second suite', function () {
    throw new Error('should never throw - second suite');
  });
});
