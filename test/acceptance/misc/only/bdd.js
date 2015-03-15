describe('should only run .only test in this bdd suite', function() {
  it('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
  it.only('should run this test', function() {
    var zero = 0;
    zero.should.equal(0, 'this .only test should run');
  });
  it('should run this test, not (title of the .only test is a prefix of this)', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
  it('(title of the .only test is a suffix of this) NOT should run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});
