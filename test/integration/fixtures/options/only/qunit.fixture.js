suite.only('should run all tests in this suite');

test('should run this test #1', function() {});

test('should run this test #2', function() {});

test('should run this test #3', function() {});

test('should run this test #4', function() {});

test('should run this test #5', function() {});


suite('should not run any of this suite\'s tests');

test('should not run this test', function() {
  (false).should.equal(true);
});

test('should not run this test', function() {
  (false).should.equal(true);
});

test('should not run this test', function() {
  (false).should.equal(true);
});