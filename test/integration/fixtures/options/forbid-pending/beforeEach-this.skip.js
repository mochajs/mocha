'use strict';

describe('forbid pending - beforeEach calls `skip()`', function() {
  it('test', function() {});
  beforeEach(function() {
    this.skip();
  });
});
