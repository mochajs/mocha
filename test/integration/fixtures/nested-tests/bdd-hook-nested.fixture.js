'use strict';

// BDD hook nested test fixture - should fail with nested test error
describe('Hook Nested Test Suite', function() {
  before(function() {
    // This should fail due to nested test inside hook
    it('nested test in before hook', function() {
      // This nested test should cause an error
    });
  });

  it('normal test', function() {
    // This should pass if no hook error
  });
});