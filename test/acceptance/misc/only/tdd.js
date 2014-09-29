suite('should only run .only test in this tdd suite', function() {
  test('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
  test.only('should run this test', function() {
    var zero = 0;
    zero.should.equal(0, 'this .only test should run');
  });
  test('should run this test, not (includes the title of the .only test)', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});
