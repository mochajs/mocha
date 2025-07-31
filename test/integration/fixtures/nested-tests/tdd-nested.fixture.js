'use strict';

// TDD nested test fixture - should fail with nested test error
suite('Parent Suite', function() {
  test('normal test', function() {
    // This should pass
  });

  test('outer test with nested test', function() {
    // This should fail due to nested test
    test('inner nested test', function() {
      // This nested test should cause an error
    });
  });

  test('another normal test', function() {
    // This should not run due to previous failure
  });
});
