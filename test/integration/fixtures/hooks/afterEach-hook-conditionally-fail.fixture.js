'use strict';

describe('something', function() {
  it('should one', function() {
    this.ok = true;
  });

  it('should two', function() {
    this.ok = false;
  });

  it('should three', function() {
    this.ok = true;
  });

  afterEach(function() {
    if (!this.ok) {
      this.test.error(new Error('something went wrong'));
    }
  });
});
