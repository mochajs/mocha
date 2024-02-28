'use strict';

describe('test marked with only and beforeEach has skip', function() {
  beforeEach(function() {
    this.skip();
  });
  it.only('only test', function() {});
});
