// Root-only test cases
test.only('#Root-Suite, should run this qunit test-case #1', function() {
  (true).should.equal(true);
});

test('#Root-Suite, should not run this qunit test-case #2', function() {
  (false).should.equal(true);
});

test('#Root-Suite, should not run this qunit test-case #3', function() {
  (false).should.equal(true);
});