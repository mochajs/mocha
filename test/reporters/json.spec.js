'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

var TEMP_FILE_PATH = path.resolve('output.json.tmp');

describe('json reporter', function () {
  var suite, runner;

  after(function () {
    if (fs.existsSync(TEMP_FILE_PATH)) {
      fs.unlinkSync(TEMP_FILE_PATH);
    }
  });

  describe('with no output specified', function () {
    beforeEach(function () {
      var mocha = new Mocha({
        reporter: 'json'
      });
      suite = new Suite('JSON suite', 'root');
      runner = new Runner(suite);
      /* eslint no-unused-vars: off */
      var mochaReporter = new mocha._reporter(runner);
    });
    it('should have 1 test failure', function (done) {
      var testTitle = 'json test 1';
      var error = { message: 'oh shit' };

      suite.addTest(new Test(testTitle, function (done) {
        done(new Error(error.message));
      }));

      runner.run(function (failureCount) {
        expect(failureCount).to.be(1);
        expect(runner).to.have.property('testResults');
        expect(runner.testResults).to.have.property('failures');
        expect(runner.testResults.failures).to.be.an('array');
        expect(runner.testResults.failures).to.have.length(1);

        var failure = runner.testResults.failures[0];
        expect(failure).to.have.property('title', testTitle);
        expect(failure.err.message).to.equal(error.message);
        expect(failure).to.have.property('err');

        done();
      });
    });

    it('should have 1 test pending', function (done) {
      var testTitle = 'json test 1';

      suite.addTest(new Test(testTitle));

      runner.run(function (failureCount) {
        expect(failureCount).to.be(0);
        expect(runner).to.have.property('testResults');
        expect(runner.testResults).to.have.property('pending');
        expect(runner.testResults.pending).to.be.an('array');
        expect(runner.testResults.pending).to.have.length(1);

        var pending = runner.testResults.pending[0];
        expect(pending).to.have.property('title', testTitle);

        done();
      });
    });
  });

  describe('with output specified', function () {
    beforeEach(function () {
      var mocha = new Mocha({
        reporter: 'json'
      });
      suite = new Suite('JSON suite', 'root');
      runner = new Runner(suite);
      /* eslint no-unused-vars: off */
      var mochaReporter = new mocha._reporter(runner, { reporterOptions: { output: TEMP_FILE_PATH } });
    });

    it('should have 1 test failure', function (done) {
      var testTitle = 'json test 1';
      var error = { message: 'oh shit' };

      suite.addTest(new Test(testTitle, function (done) {
        done(new Error(error.message));
      }));

      runner.run(function (failureCount) {
        expect(failureCount).to.be(1);
        expect(runner).to.have.property('testResults');
        expect(runner.testResults).to.have.property('failures');
        expect(runner.testResults.failures).to.be.an('array');
        expect(runner.testResults.failures).to.have.length(1);

        var failure = runner.testResults.failures[0];
        expect(failure).to.have.property('title', testTitle);
        expect(failure.err.message).to.equal(error.message);
        expect(failure).to.have.property('err');

        var fileContents;
        try {
          fileContents = JSON.parse(fs.readFileSync(TEMP_FILE_PATH, 'utf-8'));
        } catch (e) {
          done(e);
          return;
        }

        assert.deepEqual(fileContents, {
          stats: {
            suites: 1,
            tests: 1,
            passes: 0,
            pending: 0,
            failures: 1,
            start: fileContents.stats.start,
            end: fileContents.stats.end,
            duration: fileContents.stats.duration
          },
          tests: [{
            title: 'json test 1',
            fullTitle: 'JSON suite json test 1',
            duration: fileContents.tests[0].duration,
            currentRetry: 0,
            err: {
              stack: fileContents.tests[0].err.stack,
              message: 'oh shit'
            }
          }],
          pending: [],
          failures: [{
            title: 'json test 1',
            fullTitle: 'JSON suite json test 1',
            duration: fileContents.failures[0].duration,
            currentRetry: 0,
            err: {
              stack: fileContents.failures[0].err.stack,
              message: 'oh shit'
            }
          }],
          passes: []
        });
        assert.equal(Date.now() - new Date(fileContents.stats.start).getTime() < 10000, true);
        assert.equal(Date.now() - new Date(fileContents.stats.end).getTime() < 10000, true);
        assert.equal(typeof fileContents.stats.duration, 'number', JSON.stringify({ fileContents }, null, 2));
        assert.equal(fileContents.stats.duration <= 10, true, JSON.stringify({ fileContents }, null, 2));
        assert.equal(typeof fileContents.tests[0].duration, 'number', JSON.stringify({ fileContents }, null, 2));
        assert.equal(fileContents.tests[0].duration <= 10, true, JSON.stringify({ fileContents }, null, 2));
        assert.equal(typeof fileContents.failures[0].duration, 'number', JSON.stringify({ fileContents }, null, 2));
        assert.equal(fileContents.failures[0].duration <= 10, true, JSON.stringify({ fileContents }, null, 2));
        var errLines = fileContents.tests[0].err.stack.split('\n');
        assert.equal(errLines[0], 'Error: oh shit', JSON.stringify({ fileContents }, null, 2));
        var regexResult = /^ {4}at ((Object)|(Context))\.<anonymous> \(test(\/|\\)reporters(\/|\\)json\.spec\.js:92:14\)$/g.exec(errLines[1]);
        assert.equal(!!regexResult, true, JSON.stringify({ regexResult, fileContents, line: errLines[1] }, null, 2));
        errLines = fileContents.failures[0].err.stack.split('\n');
        assert.equal(errLines[0], 'Error: oh shit', JSON.stringify({ fileContents }, null, 2));
        regexResult = /^ {4}at ((Object)|(Context))\.<anonymous> \(test(\/|\\)reporters(\/|\\)json\.spec\.js:92:14\)$/g.exec(errLines[1]);
        assert.equal(!!regexResult, true, JSON.stringify({ regexResult, fileContents, line: errLines[1] }, null, 2));

        done();
      });
    });

    it('should have 1 test pending', function (done) {
      var testTitle = 'json test 1';

      suite.addTest(new Test(testTitle));

      runner.run(function (failureCount) {
        expect(failureCount).to.be(0);
        expect(runner).to.have.property('testResults');
        expect(runner.testResults).to.have.property('pending');
        expect(runner.testResults.pending).to.be.an('array');
        expect(runner.testResults.pending).to.have.length(1);

        var pending = runner.testResults.pending[0];
        expect(pending).to.have.property('title', testTitle);

        var fileContents;
        try {
          fileContents = JSON.parse(fs.readFileSync(TEMP_FILE_PATH, 'utf-8'));
        } catch (e) {
          done(e);
          return;
        }

        assert.deepEqual(fileContents, {
          stats: {
            suites: 1,
            tests: 1,
            passes: 0,
            pending: 1,
            failures: 0,
            start: fileContents.stats.start,
            end: fileContents.stats.end,
            duration: fileContents.stats.duration
          },
          tests: [{
            title: 'json test 1',
            fullTitle: 'JSON suite json test 1',
            currentRetry: 0,
            err: {}
          }],
          pending: [{
            title: 'json test 1',
            fullTitle: 'JSON suite json test 1',
            currentRetry: 0,
            err: {}
          }],
          failures: [],
          passes: []
        });
        assert.equal(Date.now() - new Date(fileContents.stats.start).getTime() < 10000, true);
        assert.equal(Date.now() - new Date(fileContents.stats.end).getTime() < 10000, true);

        done();
      });
    });
  });
});
