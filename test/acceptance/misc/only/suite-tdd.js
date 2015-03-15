suite('should not run this tdd suite', function() {
  test('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});

suite.only('should run this .only tdd suite', function() {
  test.only('should run this test', function() {
    var zero = 0;
    zero.should.equal(0, 'this test in a .only suite should run');
  });
});

suite('should run this .only tdd suite, not (title of the .only suite is a prefix of this with no space)', function() {
  test('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});

suite('(title of the .only suite is a suffix of this) NOT should run this .only tdd suite', function() {
  test('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});