'use strict';

describe('suite with process.exit(1)', function () {
  it('should fail when calling process.exit(1)', function () {
    process.exit(1);
  });

  it('should still run this test after process.exit(1)', function () {
    // This test should execute and pass
    expect(true, 'to be', true);
  });
});
