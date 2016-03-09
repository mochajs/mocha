suite('should only run .only test in this tdd suite', function() {
  test('should not run this test', function() {
    (0).should.equal(1, 'this test should have been skipped');
  });
  test.only('should run this test', function() {
    (0).should.equal(0, 'this .only test should run');
  });
  test('should run this test, not (includes the title of the .only test)', function() {
    (0).should.equal(1, 'this test should have been skipped');
  });
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

suite.only('should run all tests in this tdd suite', function() {
  test('should run this test #1', function() {
    (true).should.equal(true);
  });

  test('should run this test #2', function() {
    (1).should.equal(1);
  });

  test('should run this test #3', function() {
    ('foo').should.equal('foo');
  });
});

suite('should run only suites that marked as `only`', function() {
  suite.only('should run all this tdd suite', function() {
    test('should run this test #1', function() {
      (true).should.equal(true);
    });

    test('should run this test #2', function() {
      (true).should.equal(true);
    });
  });

  suite('should not run this suite', function() {
    test('should not run this test', function() {
      (true).should.equal(false);
    });
  });
});

// Nested situation
suite('should not run parent tests', function() {
  test('should not run this test', function() {
    (true).should.equal(false);
  });
  suite('and not the child tests too', function() {
    test('should not run this test', function() {
      (true).should.equal(false);
    });
    suite.only('but run all the tests in this suite', function() {
      test('should run this test #1', function() {
        (true).should.equal(true);
      });
      test('should run this test #2', function() {
        (true).should.equal(true);
      });
    });
  });
});

// mark test as `only` override the suite behavior
suite.only('should run only tests that marked as `only`', function() {
  test('should not run this test #1', function() {
    (false).should.equal(true);
  });

  test.only('should run this test #2', function() {
    (true).should.equal(true);
  });

  test('should not run this test #3', function() {
    (false).should.equal(true);
  });

  test.only('should run this test #4', function() {
    (true).should.equal(true);
  });
});

suite.only('Should run only test cases that mark as only', function() {
  test.only('should runt his test', function() {
    (true).should.equal(true);
  });

  test('should not run this test', function() {
    (false).should.equal(true);
  });

  suite('should not run this suite', function() {
    test('should not run this test', function() {
      (false).should.equal(true);
    });
  });
});

// Root Suite
test.only('#Root-Suite, should run this test-case #1', function() {
  (true).should.equal(true);
});

test.only('#Root-Suite, should run this test-case #2', function() {
  (true).should.equal(true);
});

test('#Root-Suite, should not run this test', function() {
  (false).should.equal(true);
});
