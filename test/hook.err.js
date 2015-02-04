var Mocha = require('../');
var Test = Mocha.Test;
var should = require('should');
var blankOpts = { reporter: function() {} }; // no output

// TODO: Needs improvements, such as nested suits, multiple same-type hooks, etc

describe.only('hook error handling', function() {
  var TEST_COUNT = 5;

  function addTestsToSuite(suite, calls) {
    for (var i = 0; i < TEST_COUNT; ++i) {
      (function(n) {
        suite.addTest(new Test('test'+n, function() {
          calls.push('test'+n);
        }));
      })(i);
    }
  }

  describe('beforeAll hook', function() {
    it('sync error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
        throw new Error('sync beforeAll fail');
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
      });
      addTestsToSuite(suite, calls);
      suite.afterEach('afterEachHook', function() {
        calls.push('afterEach');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      expectedCalls.push('afterAll');

      mocha.run();

    })

    it('async error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
        process.nextTick(function() {
          throw new Error('async beforeAll fail');
        });
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
      });
      addTestsToSuite(suite, calls);
      suite.afterEach('afterEachHook', function() {
        calls.push('afterEach');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      expectedCalls.push('afterAll');

      mocha.run();

    })
  })

  describe('beforeEach hook', function() {
    it('sync error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
        throw new Error('sync beforeEach fail');
      });
      addTestsToSuite(suite, calls);
      suite.afterEach('afterEachHook', function() {
        calls.push('afterEach');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      for (var i = 0; i < TEST_COUNT; ++i) {
        expectedCalls.push('beforeEach');
        expectedCalls.push('afterEach');
      }
      expectedCalls.push('afterAll');

      mocha.run();

    })

    it('async error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
      });
      suite.beforeEach('beforeEachHook', function(done) {
        calls.push('beforeEach');
        process.nextTick(function() {
          throw new Error('async beforeEach fail');
        });
      });
      addTestsToSuite(suite, calls);
      suite.afterEach('afterEachHook', function() {
        calls.push('afterEach');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      for (var i = 0; i < TEST_COUNT; ++i) {
        expectedCalls.push('beforeEach');
        expectedCalls.push('afterEach');
      }
      expectedCalls.push('afterAll');

      mocha.run();

    })
  })

  describe('test', function() {
    it('sync error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
      });
      for (var i = 0; i < TEST_COUNT; ++i) {
        (function(n) {
          suite.addTest(new Test('test'+n, function() {
            calls.push('test'+n);
            throw new Error('sync test'+n+' fail');
          }));
        })(i);
      }
      suite.afterEach('afterEachHook', function() {
        calls.push('afterEach');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      for (var i = 0; i < TEST_COUNT; ++i) {
        expectedCalls.push('beforeEach');
        expectedCalls.push('test'+i);
        expectedCalls.push('afterEach');
      }
      expectedCalls.push('afterAll');

      mocha.run();

    })

    it('async error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
      });
      for (var i = 0; i < TEST_COUNT; ++i) {
        (function(n) {
          suite.addTest(new Test('test'+n, function() {
            calls.push('test'+n);
            process.nextTick(function() {
              throw new Error('sync test'+n+' fail');
            });
          }));
        })(i);
      }
      suite.afterEach('afterEachHook', function(done) {
        calls.push('afterEach');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      for (var i = 0; i < TEST_COUNT; ++i) {
        expectedCalls.push('beforeEach');
        expectedCalls.push('test'+i);
        expectedCalls.push('afterEach');
      }
      expectedCalls.push('afterAll');

      mocha.run();

    })
  })

  describe('afterEach hook', function() {
    it('sync error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
      });
      addTestsToSuite(suite, calls);
      suite.afterEach('afterEachHook', function() {
        calls.push('afterEach');
        throw new Error('sync afterEach fail');
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      for (var i = 0; i < TEST_COUNT; ++i) {
        expectedCalls.push('beforeEach');
        expectedCalls.push('test'+i);
        expectedCalls.push('afterEach');
      }
      expectedCalls.push('afterAll');

      mocha.run();

    })

    it('async error', function(done) {

      var mocha = new Mocha(blankOpts);
      var suite = mocha.suite;
      var calls = [];
      var expectedCalls = [];

      suite.beforeAll('beforeAllHook', function() {
        calls.push('beforeAll');
      });
      suite.beforeEach('beforeEachHook', function() {
        calls.push('beforeEach');
      });
      addTestsToSuite(suite, calls);
      suite.afterEach('afterEachHook', function(done) {
        calls.push('afterEach');
        process.nextTick(function() {
          throw new Error('async beforeEach fail');
        });
      });
      suite.afterAll('afterAllHook', function() {
        calls.push('afterAll');
        process.nextTick(function() {
          calls.should.eql(expectedCalls);
          done();
        });
      });

      expectedCalls.push('beforeAll');
      for (var i = 0; i < TEST_COUNT; ++i) {
        expectedCalls.push('beforeEach');
        expectedCalls.push('test'+i);
        expectedCalls.push('afterEach');
      }
      expectedCalls.push('afterAll');

      mocha.run();

    })
  })
})
