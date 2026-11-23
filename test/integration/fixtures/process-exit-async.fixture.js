'use strict';

describe('async process.exit', function () {
  it('should fail when calling process.exit(0) in a setTimeout', function (done) {
    setTimeout(function () {
      process.exit(0);
    }, 10);
    // Don't call done — the exit should be intercepted as uncaught exception
  });

  it('should still run after async process.exit', function () {
    expect(true, 'to be', true);
  });
});
