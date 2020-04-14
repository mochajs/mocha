'use strict';

var sinon = require('sinon');
var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

describe('JSON reporter', function() {
  var sandbox;
  var suite;
  var runner;
  var testTitle = 'json test 1';
  var noop = function() {};

  beforeEach(function() {
    var mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
    var options = {};
    /* eslint no-unused-vars: off */
    var mochaReporter = new mocha._reporter(runner, options);
  });

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    sandbox.stub(process.stdout, 'write').callsFake(noop);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should have 1 test failure', function(done) {
    var error = {message: 'oh shit'};

    suite.addTest(
      new Test(testTitle, function(done) {
        done(new Error(error.message));
      })
    );

    runner.run(function(failureCount) {
      sandbox.restore();
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
      sandbox.restore();
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

  it('should have 1 test skipped', function(done) {
    suite.skipped = true;
    suite.addTest(new Test(testTitle, noop));

    runner.run(function(failureCount) {
      sandbox.restore();
      expect(runner, 'to satisfy', {
        testResults: {
          skipped: [
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
      sandbox.restore();
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
