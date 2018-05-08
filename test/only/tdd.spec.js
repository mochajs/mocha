'use strict';

suite('should only run .only test in this tdd suite', function() {
  test('should not run this test', function() {
    expect(0, 'to be', 1, 'this test should have been skipped');
  });
  test.only('should run this test', function() {
    expect(0, 'to be', 0, 'this .only test should run');
  });
  test('should run this test, not (includes the title of the .only test)', function() {
    expect(0, 'to be', 1, 'this test should have been skipped');
  });
});

suite('should not run this suite', function() {
  test('should not run this test', function() {
    expect(true, 'to be', false);
  });

  test('should not run this test', function() {
    expect(true, 'to be', false);
  });

  test('should not run this test', function() {
    expect(true, 'to be', false);
  });
});

suite.only('should run all tests in this tdd suite', function() {
  test('should run this test #1', function() {
    expect(true, 'to be', true);
  });

  test('should run this test #2', function() {
    expect(1, 'to be', 1);
  });

  test('should run this test #3', function() {
    expect('foo', 'to be', 'foo');
  });
});

suite('should run only suites that marked as `only`', function() {
  suite.only('should run all this tdd suite', function() {
    test('should run this test #1', function() {
      expect(true, 'to be', true);
    });

    test('should run this test #2', function() {
      expect(true, 'to be', true);
    });
  });

  suite('should not run this suite', function() {
    test('should not run this test', function() {
      expect(true, 'to be', false);
    });
  });
});

// Nested situation
suite('should not run parent tests', function() {
  test('should not run this test', function() {
    expect(true, 'to be', false);
  });
  suite('and not the child tests too', function() {
    test('should not run this test', function() {
      expect(true, 'to be', false);
    });
    suite.only('but run all the tests in this suite', function() {
      test('should run this test #1', function() {
        expect(true, 'to be', true);
      });
      test('should run this test #2', function() {
        expect(true, 'to be', true);
      });
    });
  });
});

// mark test as `only` override the suite behavior
suite.only('should run only tests that marked as `only`', function() {
  test('should not run this test #1', function() {
    expect(false, 'to be', true);
  });

  test.only('should run this test #2', function() {
    expect(true, 'to be', true);
  });

  test('should not run this test #3', function() {
    expect(false, 'to be', true);
  });

  test.only('should run this test #4', function() {
    expect(true, 'to be', true);
  });
});

suite.only('Should run only test cases that mark as only', function() {
  test.only('should runt his test', function() {
    expect(true, 'to be', true);
  });

  test('should not run this test', function() {
    expect(false, 'to be', true);
  });

  suite('should not run this suite', function() {
    test('should not run this test', function() {
      expect(false, 'to be', true);
    });
  });
});

// Root Suite
test.only('#Root-Suite, should run this test-case #1', function() {
  expect(true, 'to be', true);
});

test.only('#Root-Suite, should run this test-case #2', function() {
  expect(true, 'to be', true);
});

test('#Root-Suite, should not run this test', function() {
  expect(false, 'to be', true);
});
