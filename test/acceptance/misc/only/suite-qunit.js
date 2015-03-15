function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

suite('should not run this qunit suite');

test('should not run this test', function() {
  ok(0 === 1, 'this test should have been skipped');
});

suite.only('should run this .only qunit suite');

test('should run this test', function() {
  ok(0 === 0, 'this test in a .only suite should run');
});

suite('should run this .only qunit suite, not (title of the .only suite is a prefix of this with no space)');

test('should not run this test', function() {
  ok(0 === 1, 'this test should have been skipped');
});

suite('(title of the .only suite is a suffix of this) NOT should run this .only qunit suite');

test('should not run this test', function() {
  ok(0 === 1, 'this test should have been skipped');
});