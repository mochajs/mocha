'use strict';

describe('suite with process.exit(0)', function () {
  it('should fail when calling process.exit(0)', function () {
    process.exit(0);
  });

  it('should still run this test after process.exit(0)', function () {
    // This test should execute and pass
    expect(true, 'to be', true);
  });
});
