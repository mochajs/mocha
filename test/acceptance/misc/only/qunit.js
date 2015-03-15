function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

suite('should only run .only test in this qunit suite');

test('should not run this test', function() {
  ok(0 === 1, 'this test should have been skipped');
});
test.only('should run this test', function() {
  ok(0 === 0, 'this .only test should run');
});
test('should run this test, not (title of the .only test is a prefix of this)', function() {
  ok(0 === 1, 'this test should have been skipped');
});
test('(title of the .only test is a suffix of this) NOT should run this test', function() {
  ok(0 === 1, 'this test should have been skipped');
});
