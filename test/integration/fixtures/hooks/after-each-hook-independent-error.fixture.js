'use strict';

// See https://github.com/mochajs/mocha/issues/5925
// A throwing `afterEach` with no earlier failure in the test's flow is an
// independent failure, NOT a cascade, so it must not be marked secondary.
describe('passing suite', function () {
  afterEach(function () {
    throw new Error('standalone cleanup failed');
  });

  it('passes', function () {});
});
