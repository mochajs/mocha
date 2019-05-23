'use strict';

describe('test marked with only and before has skip', function() {
  before(function() {
    this.skip();
  });
  it.only('only test', function() {});
});
