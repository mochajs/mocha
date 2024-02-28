'use strict';

/**
 * This file should generate only one failure per spec for the thrown error.
 * It should not report misleading 'multiple calls to done()'.
 */

it('fails exactly once when a global error is thrown synchronously and done errors', function (done) {
  setTimeout(function () {
    done(new Error('test error'));
  }, 1); // Not 0 - it will 'succeed', but won't test the breaking condition

  throw new Error('sync error a');
});

it('fails exactly once when a global error is thrown synchronously and done completes', function (done) {
  setTimeout(function () {
    done();
  }, 1); // Not 0 - it will 'succeed', but won't test the breaking condition

  throw new Error('sync error b');
});
