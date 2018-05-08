'use strict';

// Root-only test cases
it.only('#Root-Suite, should run this bdd test-case #1', function() {
  expect(true, 'to be', true);
});

it('#Root-Suite, should not run this bdd test-case #2', function() {
  expect(false, 'to be', true);
});

it('#Root-Suite, should not run this bdd test-case #3', function() {
  expect(false, 'to be', true);
});
