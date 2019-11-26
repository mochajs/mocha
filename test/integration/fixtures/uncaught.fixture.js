'use strict';

/**
 * This file should only generate one failure per spec despite the fact that
 * Mocha is capable of detecting two distinct exceptions during test execution.
 */

it('fails exactly once when a global error is thrown first', function (done) {
  process.nextTick(function () {
    throw new Error('global error');
  });
});

it('fails exactly once when a global error is thrown second', function (done) {
  process.nextTick(function () {
    done(new Error('test error'));
  });

  process.nextTick(function () {
    throw new Error('global error');
  });
});
