'use strict';

// See https://github.com/mochajs/mocha/issues/5925
// A failing `beforeEach` in a nested suite plus a throwing `afterEach` in the
// parent suite: the parent teardown error is a cascade and should be reported
// as secondary, keeping the nested setup failure as the primary root cause.
describe('outer suite', function () {
  afterEach(function () {
    throw new Error('outer cleanup failed');
  });

  describe('inner suite', function () {
    beforeEach(function () {
      throw new Error('inner setup failed');
    });

    it('does something', function () {});
  });
});
