'use strict';

describe('forbid pending - test calls `skip()`', function() {
  it('test1', function() {});
  it('test2', function() {
    this.skip();
  });
  it('test3', function() {});
});
