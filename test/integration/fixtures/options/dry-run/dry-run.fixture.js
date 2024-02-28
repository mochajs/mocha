'use strict';

describe.only('suite1', function() {
  it.skip('test1 - report as skipped', function() { });

  it('test2 - report as passed', function() { });

  it('test3 - report as passed', function() {
    throw new Error('this test should not run');
  });
});

describe('suite2', function () {
  before(function() {
    throw new Error('this hook should not run');
  });
  beforeEach(function() {
    throw new Error('this hook should not run');
  });

  it.only('test4 - report as passed', function () {
    throw new Error('this test should not run');
  });

  it('test5 - should be ignored', function () {
    throw new Error('this test should not run');
  });

  afterEach(function() {
    throw new Error('this hook should not run');
  });
  after(function() {
    throw new Error('this hook should not run');
  });
});
