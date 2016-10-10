'use strict';

/**
 * This file should only generate one failure per spec despite the fact that
 * Mocha is capable of detecting two distinct exceptions during test execution.
 */

it('fails exactly once when a global error is thrown first', function (done) {
  setTimeout(function () {
    throw new Error('global error');
  }, 0);
});

it('fails exactly once when a global error is thrown second', function (done) {
  setTimeout(function () {
    done(new Error('test error'));
  }, 0);

  setTimeout(function () {
    throw new Error('global error');
  }, 0);
});
