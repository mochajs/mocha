'use strict';

var fs = require('fs');
var sinon = require('sinon');
var JSONReporter = require('../../lib/reporters/json');
var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

describe('JSON reporter', function() {
  var mocha;
  var suite;
  var runner;
  var testTitle = 'json test 1';
  var testFile = 'someTest.spec.js';
  var noop = function() {};

  beforeEach(function() {
    mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('test results', function() {
    beforeEach(function() {
      var options = {};
      /* eslint no-unused-vars: off */
      var mochaReporter = new mocha._reporter(runner, options);
    });

    beforeEach(function() {
      sinon.stub(process.stdout, 'write').callsFake(noop);
    });

    it('should have 1 test failure', function(done) {
      var error = {message: 'oh shit'};

      var test = new Test(testTitle, function(done) {
        done(new Error(error.message));
      });

      test.file = testFile;
      suite.addTest(test);

      runner.run(function(failureCount) {
        sinon.restore();
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
        sinon.restore();
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

    it('should have 1 test pass', function(done) {
      const test = new Test(testTitle, () => {});

      test.file = testFile;
      suite.addTest(test);

      runner.run(function(failureCount) {
        expect(runner, 'to satisfy', {
          testResults: {
            passes: [
              {
                title: testTitle,
                file: testFile,
                speed: /(slow|medium|fast)/
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
        sinon.restore();
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

  describe("when 'reporterOptions.output' is provided", function() {
    var expectedDirName = 'reports';
    var expectedFileName = 'reports/test-results.json';
    var options = {
      reporterOptions: {
        output: expectedFileName
      }
    };

    beforeEach(function() {
      /* eslint no-unused-vars: off */
      var mochaReporter = new mocha._reporter(runner, options);
    });

    beforeEach(function() {
      // Add one test to suite to avoid assertions against empty test results
      var test = new Test(testTitle, () => {});
      test.file = testFile;
      suite.addTest(test);
    });

    describe('when file can be created', function() {
      it('should write test results to file', function(done) {
        var fsMkdirSync = sinon.stub(fs, 'mkdirSync');
        var fsWriteFileSync = sinon.stub(fs, 'writeFileSync');

        fsWriteFileSync.callsFake(function(filename, content) {
          var expectedJson = JSON.stringify(runner.testResults, null, 2);
          expect(expectedFileName, 'to be', filename);
          expect(content, 'to be', expectedJson);
        });

        runner.run(function() {
          fsMkdirSync.calledWith(expectedDirName, {recursive: true});
          expect(fsWriteFileSync.calledOnce, 'to be true');
          done();
        });
      });
    });

    describe('when run in browser', function() {
      it('should throw unsupported error', function() {
        sinon.stub(fs, 'writeFileSync').value(false);
        expect(
          () => new JSONReporter(runner, options),
          'to throw',
          'file output not supported in browser'
        );
      });
    });
  });
});
