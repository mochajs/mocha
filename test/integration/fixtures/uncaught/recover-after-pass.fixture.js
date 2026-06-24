'use strict';

// A test that has already passed throws asynchronously. Mocha should fail that
// test but keep running the remaining tests instead of bailing out.
describe('recover after pass', function () {
  describe('first suite', function () {
    it('passes synchronously then fails asynchronously', function (done) {
      done();
      process.nextTick(function () {
        throw new Error('global error');
      });
    });

    it('still runs after the async failure', function () {});
  });

  describe('second suite', function () {
    it('also still runs', function () {});
  });
});
