'use strict';

// Throws on the next tick, racing Runner.immediately(prepare). Before the
// #6116 guard, prepare() could still start the suite after the reporter had
// already printed the uncaught-error summary.
process.nextTick(() => {
  throw new Error('boom');
});

describe('suite', function () {
  it('should pass', function () {});
});
