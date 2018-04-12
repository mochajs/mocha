'use strict';

var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

describe('json reporter', function() {
  var suite, runner;
  var testTitle = 'json test 1';

  beforeEach(function() {
    var mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
    /* eslint no-unused-vars: off */
    var mochaReporter = new mocha._reporter(runner);
  });

  it('should have 1 test failure', function(done) {
    var error = {message: 'oh shit'};

    suite.addTest(
      new Test(testTitle, function(done) {
        done(new Error(error.message));
      })
    );

    runner.run(function(failureCount) {
      expect(runner, 'to satisfy', {
        testResults: {
          failures: [
            {
              title: testTitle,
              err: {
                message: error.message
              }
            }
          ]
        }
      });
      expect(failureCount, 'to be', 1);
      done();
    });
  });

  it('should have 1 test pending', function(done) {
    suite.addTest(new Test(testTitle));

    runner.run(function(failureCount) {
      expect(runner, 'to satisfy', {
        testResults: {
          pending: [
            {
              title: testTitle
            }
          ]
        }
      });
      expect(failureCount, 'to be', 0);
      done();
    });
  });

  it('should handle circular objects in errors', function(done) {
    var testTitle = 'json test 1';
    function CircleError() {
      this.message = 'oh shit';
      this.circular = this;
    }
    var error = new CircleError();

    suite.addTest(
      new Test(testTitle, function(done) {
        throw error;
      })
    );

    runner.run(function(failureCount) {
      expect(runner, 'to satisfy', {
        testResults: {
          failures: [
            {
              title: testTitle,
              err: {
                message: error.message
              }
            }
          ]
        }
      });
      expect(failureCount, 'to be', 1);
      done();
    });
  });
});
