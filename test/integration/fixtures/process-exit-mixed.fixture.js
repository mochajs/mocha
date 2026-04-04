'use strict';

describe('suite with process.exit in the middle', function () {
  it('first test passes', function () {
    expect(1 + 1, 'to be', 2);
  });

  it('second test calls process.exit(0)', function () {
    process.exit(0);
  });

  it('third test should still run', function () {
    expect(true, 'to be', true);
  });
});
