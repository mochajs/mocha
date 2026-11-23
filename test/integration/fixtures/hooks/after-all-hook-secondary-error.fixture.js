'use strict';

// See https://github.com/mochajs/mocha/issues/5925
// A failing test in a nested suite plus a throwing `after all` in the parent
// suite: the parent teardown error is a cascade and should be reported as
// secondary, keeping the nested test failure as the primary root cause.
describe('outer suite', function () {
  after(function () {
    throw new Error('outer cleanup failed');
  });

  describe('inner suite', function () {
    it('fails for the real reason', function () {
      throw new Error('inner test failed');
    });
  });
});
