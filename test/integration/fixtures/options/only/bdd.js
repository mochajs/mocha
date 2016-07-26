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

describe.only('should run this suite too', function() {
  describe('should run this nested suite', function () {
    it('should run this test', function() {});

    it('should run this test', function() {});

    it('should run this test', function() {});
  });
});

describe.only('should run this suite, even', function() {
  describe('should run this nested suite, even', function () {
    describe('should run this doubly-nested suite!', function () {
      it('should run this test', function() {});

      it('should run this test', function() {});

      it('should run this test', function() {});
    });
  });
});


describe('should run this suite with an exclusive test', function() {
  it.only('should run this test', function () {});

  describe('should not run this nested suite', function () {
    describe.only('should not run this doubly-nested suite', function () {
      it('should not run this test', function() {});

      it('should not run this test', function() {});

      it('should not run this test', function() {});
    });
  });
});

describe('should run this suite with an exclusive test (reverse order)', function() {
  describe('should not run this nested suite', function () {
    describe.only('should not run this doubly-nested suite', function () {
      it('should not run this test', function() {});

      it('should not run this test', function() {});

      it('should not run this test', function() {});
    });
  });
  it.only('should run this test', function () {});
});
