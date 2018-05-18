'use strict';

describe('forbid only - test marked with only', function() {
  it('test1', function() {});
  it.only('test2', function() {});
  it('test3', function() {});
});
