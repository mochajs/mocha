'use strict';

// Root-only test cases
test.only('#Root-Suite, should run this tdd test-case #1', function() {
  expect(true).to.equal(true);
});

test('#Root-Suite, should not run this tdd test-case #2', function() {
  expect(false).to.equal(true);
});

test('#Root-Suite, should not run this tdd test-case #3', function() {
  expect(false).to.equal(true);
});
