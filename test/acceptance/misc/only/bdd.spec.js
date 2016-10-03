describe('should only run .only test in this bdd suite', function() {
  it('should not run this test', function() {
    (0).should.equal(1, 'this test should have been skipped');
  });
  it.only('should run this test', function() {
    (0).should.equal(0, 'this .only test should run');
  });
  it('should run this test, not (includes the title of the .only test)', function() {
    (0).should.equal(1, 'this test should have been skipped');
  });
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

describe.only('should run all tests in this bdd suite', function() {
  it('should run this test #1', function() {
    (true).should.equal(true);
  });

  it('should run this test #2', function() {
    (1).should.equal(1);
  });

  it('should run this test #3', function() {
    ('foo').should.equal('foo');
  });
});

describe('should run only suites that marked as `only`', function() {
  describe.only('should run all this tdd suite', function() {
    it('should run this test #1', function() {
      (true).should.equal(true);
    });

    it('should run this test #2', function() {
      (true).should.equal(true);
    });
  });

  describe('should not run this suite', function() {
    it('should run this test', function() {
      (true).should.equal(false);
    });
  });
});

// Nested situation
describe('should not run parent tests', function() {
  it('should not run this test', function() {
    (true).should.equal(false);
  });
  describe('and not the child tests too', function() {
    it('should not run this test', function() {
      (true).should.equal(false);
    });
    describe.only('but run all the tests in this suite', function() {
      it('should run this test #1', function() {
        (true).should.equal(true);
      });
      it('should run this test #2', function() {
        (true).should.equal(true);
      });
    });
  });
});

// mark test as `only` override the suite behavior
describe.only('should run only tests that marked as `only`', function() {
  it('should not run this test #1', function() {
    (false).should.equal(true);
  });

  it.only('should run this test #2', function() {
    (true).should.equal(true);
  });

  it('should not run this test #3', function() {
    (false).should.equal(true);
  });

  it.only('should run this test #4', function() {
    (true).should.equal(true);
  });
});

describe.only('Should run only test cases that mark as only', function() {
  it.only('should runt his test', function() {
    (true).should.equal(true);
  });

  it('should not run this test', function() {
    (false).should.equal(true);
  });

  describe('should not run this suite', function() {
    it('should not run this test', function() {
      (false).should.equal(true);
    });
  });
});

// Root Suite
it.only('#Root-Suite, should run this test-case #1', function() {
  (true).should.equal(true);
});

it.only('#Root-Suite, should run this test-case #2', function() {
  (true).should.equal(true);
});

it('#Root-Suite, should not run this test', function() {
  (false).should.equal(true);
});
