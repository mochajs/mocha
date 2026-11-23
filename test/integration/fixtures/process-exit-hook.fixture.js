'use strict';

describe('process.exit in beforeEach hook', function () {
  beforeEach(function () {
    process.exit(0);
  });

  it('test one should fail due to hook', function () {
    expect(true, 'to be', true);
  });

  it('test two should also reflect hook failure', function () {
    expect(true, 'to be', true);
  });
});
