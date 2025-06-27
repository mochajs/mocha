'use strict';

// BDD nested test fixture - should fail with nested test error
describe('Parent Suite', function() {
  it('normal test', function() {
    // This should pass
  });

  it('outer test with nested test', function() {
    // This should fail due to nested test
    it('inner nested test', function() {
      // This nested test should cause an error
    });
  });

  it('another normal test', function() {
    // This should not run due to previous failure
  });
});
