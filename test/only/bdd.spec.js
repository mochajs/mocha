'use strict';

describe('should only run .only test in this bdd suite', function() {
  it('should not run this test', function() {
    expect(0, 'to be', 1, 'this test should have been skipped');
  });
  it.only('should run this test', function() {
    expect(0, 'to be', 0, 'this .only test should run');
  });
  it('should run this test, not (includes the title of the .only test)', function() {
    expect(0, 'to be', 1, 'this test should have been skipped');
  });
});

describe('should not run this suite', function() {
  it('should not run this test', function() {
    expect(true, 'to be', false);
  });

  it('should not run this test', function() {
    expect(true, 'to be', false);
  });

  it('should not run this test', function() {
    expect(true, 'to be', false);
  });
});

describe.only('should run all tests in this bdd suite', function() {
  it('should run this test #1', function() {
    expect(true, 'to be', true);
  });

  it('should run this test #2', function() {
    expect(1, 'to be', 1);
  });

  it('should run this test #3', function() {
    expect('foo', 'to be', 'foo');
  });
});

describe('should run only suites that marked as `only`', function() {
  describe.only('should run all this tdd suite', function() {
    it('should run this test #1', function() {
      expect(true, 'to be', true);
    });

    it('should run this test #2', function() {
      expect(true, 'to be', true);
    });
  });

  describe('should not run this suite', function() {
    it('should run this test', function() {
      expect(true, 'to be', false);
    });
  });
});

// Nested situation
describe('should not run parent tests', function() {
  it('should not run this test', function() {
    expect(true, 'to be', false);
  });
  describe('and not the child tests too', function() {
    it('should not run this test', function() {
      expect(true, 'to be', false);
    });
    describe.only('but run all the tests in this suite', function() {
      it('should run this test #1', function() {
        expect(true, 'to be', true);
      });
      it('should run this test #2', function() {
        expect(true, 'to be', true);
      });
    });
  });
});

// mark test as `only` override the suite behavior
describe.only('should run only tests that marked as `only`', function() {
  it('should not run this test #1', function() {
    expect(false, 'to be', true);
  });

  it.only('should run this test #2', function() {
    expect(true, 'to be', true);
  });

  it('should not run this test #3', function() {
    expect(false, 'to be', true);
  });

  it.only('should run this test #4', function() {
    expect(true, 'to be', true);
  });
});

describe.only('Should run only test cases that mark as only', function() {
  it.only('should runt his test', function() {
    expect(true, 'to be', true);
  });

  it('should not run this test', function() {
    expect(false, 'to be', true);
  });

  describe('should not run this suite', function() {
    it('should not run this test', function() {
      expect(false, 'to be', true);
    });
  });
});

// Root Suite
it.only('#Root-Suite, should run this test-case #1', function() {
  expect(true, 'to be', true);
});

it.only('#Root-Suite, should run this test-case #2', function() {
  expect(true, 'to be', true);
});

it('#Root-Suite, should not run this test', function() {
  expect(false, 'to be', true);
});
