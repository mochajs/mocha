'use strict';

describe('per-suite allowUncaught', function () {
  this.allowUncaught();

  it('inherits suite-level opt-in', function () {
    throw new Error('explicit-per-suite');
  });
});
