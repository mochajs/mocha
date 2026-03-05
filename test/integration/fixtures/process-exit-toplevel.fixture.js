'use strict';

// This calls process.exit at the top level, BEFORE any describe block.
// This happens during file loading, NOT during test execution.
process.exit(42);

describe('this suite should never run', function () {
  it('this test should never run', function () {
    expect(true, 'to be', true);
  });
});
