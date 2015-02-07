'use strict';

/**
 * This file should only generate one test error despite the fact that Mocha is
 * capable of detecting two distinct exceptions during test execution.
 */

it('fails exactly once', function(done) {
  setTimeout(function() {
    setTimeout(function() {
      done(new Error('test error'));
    }, 0);
    throw new Error('global error');
  }, 0);
});
