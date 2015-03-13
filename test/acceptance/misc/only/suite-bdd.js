describe('should not run this bdd suite', function() {
  it('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});

describe.only('should run this .only bdd suite', function() {
  it('should run this test', function() {
    var zero = 0;
    zero.should.equal(0, 'this test in a .only suite should run');
  });
});

describe('should run this .only bdd suite, not (title of the .only suite is a prefix of this with no space)', function() {
  it('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});

describe('(title of the .only suite is a suffix of this) NOT should run this .only bdd suite', function() {
  it('should not run this test', function() {
    var zero = 0;
    zero.should.equal(1, 'this test should have been skipped');
  });
});