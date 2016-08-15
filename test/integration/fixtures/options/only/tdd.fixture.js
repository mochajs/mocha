suite.only('should run all tests in this tdd suite', function() {
  test('should run this test #1', function() {});

  test('should run this test #2', function() {});

  test('should run this test #3', function() {});

  test('should run this test #4', function() {});
});

suite('should not run this suite', function() {
  test('should not run this test', function() {
    (true).should.equal(false);
  });

  test('should not run this test', function() {
    (true).should.equal(false);
  });

  test('should not run this test', function() {
    (true).should.equal(false);
  });
});

suite.only('should run this suite too', function() {
  suite('should run this nested suite', function () {
    test('should run this test', function() {});

    test('should run this test', function() {});

    test('should run this test', function() {});

    test('should run this test', function() {});
  });
});
