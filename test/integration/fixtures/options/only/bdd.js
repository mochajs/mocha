describe.only('should run this suite', function() {
  it('should run this test', function() {});

  it('should run this test', function() {});

  it('should run this test', function() {});
});

describe('should not run this suite', function() {
  it('should not run this test', function() {
    (true).should.equal(false);
  });

  it('should not run this test', function() {
    (true).should.equal(false);
  });

  it('should not run this test', function() {
    (true).should.equal(false);
  });
});