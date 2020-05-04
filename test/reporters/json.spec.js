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
  var testFile = 'someTest.spec.js';
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

    var test = new Test(testTitle, function(done) {
      done(new Error(error.message));
    });

    test.file = testFile;
    suite.addTest(test);

    runner.run(function(failureCount) {
      sandbox.restore();
      expect(runner, 'to satisfy', {
        testResults: {
          failures: [
            {
              title: testTitle,
              file: testFile,
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
    var test = new Test(testTitle);
    test.file = testFile;
    suite.addTest(test);

    runner.run(function(failureCount) {
      sandbox.restore();
      expect(runner, 'to satisfy', {
        testResults: {
          pending: [
            {
              title: testTitle,
              file: testFile
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

    var test = new Test(testTitle, function(done) {
      throw error;
    });

    test.file = testFile;
    suite.addTest(test);

    runner.run(function(failureCount) {
      sandbox.restore();
      expect(runner, 'to satisfy', {
        testResults: {
          failures: [
            {
              title: testTitle,
              file: testFile,
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
