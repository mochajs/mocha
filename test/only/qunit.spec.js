'use strict';

// Root Suite
test.only('#Root-Suite, should run this test-case #1', function() {
  expect(true, 'to be', true);
});

test.only('#Root-Suite, should run this test-case #2', function() {
  expect(true, 'to be', true);
});

test('#Root-Suite, should not run this test', function() {
  expect(false, 'to be', true);
});

suite('should only run .only test in this qunit suite');

test('should not run this test', function() {
  expect(0, 'to be', 1, 'this test should have been skipped');
});
test.only('should run this test', function() {
  expect(0, 'to be', 0, 'this .only test should run');
});
test('should run this test, not (includes the title of the .only test)', function() {
  expect(0, 'to be', 1, 'this test should have been skipped');
});

// Mark suite
suite.only('should run all tests in this suite');

test('should run this test #1', function() {
  expect(true, 'to be', true);
});

test('should run this test #2', function() {
  expect(true, 'to be', true);
});

test('should run this test #3', function() {
  expect(true, 'to be', true);
});

// Unmark this suite
suite("should not run any of this suite's tests");

test('should not run this test', function() {
  expect(false, 'to be', true);
});

test('should not run this test', function() {
  expect(false, 'to be', true);
});

test('should not run this test', function() {
  expect(false, 'to be', true);
});

// Mark test as `only` override the suite behavior
suite.only('should run only tests that marked as `only`');

test('should not run this test #1', function() {
  expect(false, 'to be', true);
});

test.only('should not run this test #2', function() {
  expect(true, 'to be', true);
});

test('should not run this test #3', function() {
  expect(false, 'to be', true);
});

test.only('should not run this test #4', function() {
  expect(true, 'to be', true);
});
