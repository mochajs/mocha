'use strict';

// Root-only test cases
test.only('#Root-Suite, should run this qunit test-case #1', function () {
  expect(true, 'to be', true);
});

test('#Root-Suite, should not run this qunit test-case #2', function () {
  expect(false, 'to be', true);
});

test('#Root-Suite, should not run this qunit test-case #3', function () {
  expect(false, 'to be', true);
});
