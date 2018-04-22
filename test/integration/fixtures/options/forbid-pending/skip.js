'use strict';

describe('forbid pending - test marked with skip', function() {
  it('test1', function() {});
  it.skip('test2', function() {});
  it('test3', function() {});
});
