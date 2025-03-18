'use strict';

const fs = require('node:fs');
const sinon = require('sinon');
const JSONReporter = require('../../lib/reporters/json');
const utils = require('../../lib/utils');
const Mocha = require('../../');
const Suite = Mocha.Suite;
const Runner = Mocha.Runner;
const Test = Mocha.Test;

describe('JSON reporter', function () {
  let mocha;
  let suite;
  let runner;
  const testTitle = 'json test 1';
  const testFile = 'someTest.spec.js';
  const noop = function () {};

  beforeEach(function () {
    mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('test results', function () {
    beforeEach(function () {
      const options = {};
      /* eslint no-unused-vars: off */
      const mochaReporter = new mocha._reporter(runner, options);
    });

    beforeEach(function () {
      sinon.stub(process.stdout, 'write').callsFake(noop);
    });

    it('should have 1 test failure', function (done) {
      const error = {message: 'oh shit'};

      const test = new Test(testTitle, function (done) {
        done(new Error(error.message));
      });

      test.file = testFile;
      suite.addTest(test);

      runner.run(function (failureCount) {
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

    it('should have 1 test pending', function (done) {
      const test = new Test(testTitle);
      test.file = testFile;
      suite.addTest(test);

      runner.run(function (failureCount) {
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

    it('should have 1 test pass', function (done) {
      const test = new Test(testTitle, () => {});

      test.file = testFile;
      suite.addTest(test);

      runner.run(function (failureCount) {
        sinon.restore();
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

    it('should handle circular objects in errors', function (done) {
      const testTitle = 'json test 1';
      function CircleError() {
        this.message = 'oh shit';
        this.circular = this;
      }
      const error = new CircleError();

      const test = new Test(testTitle, function (done) {
        throw error;
      });

      test.file = testFile;
      suite.addTest(test);

      runner.run(function (failureCount) {
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

  describe('when "reporterOption.output" is provided', function () {
    const expectedDirName = 'reports';
    const expectedFileName = 'reports/test-results.json';
    const options = {
      reporterOption: {
        output: expectedFileName
      }
    };

    beforeEach(function () {
      /* eslint no-unused-vars: off */
      const mochaReporter = new mocha._reporter(runner, options);
    });

    beforeEach(function () {
      // Add one test to suite to avoid assertions against empty test results
      const test = new Test(testTitle, () => {});
      test.file = testFile;
      suite.addTest(test);
    });

    it('should write test results to file', function (done) {
      const fsMkdirSync = sinon.stub(fs, 'mkdirSync');
      const fsWriteFileSync = sinon.stub(fs, 'writeFileSync');

      fsWriteFileSync.callsFake(function (filename, content) {
        const expectedJson = JSON.stringify(runner.testResults, null, 2);
        expect(expectedFileName, 'to be', filename);
        expect(content, 'to be', expectedJson);
      });

      runner.run(function () {
        expect(
          fsMkdirSync.calledWith(expectedDirName, {recursive: true}),
          'to be true'
        );
        expect(fsWriteFileSync.calledOnce, 'to be true');
        done();
      });
    });

    it('should warn and write test results to console', function (done) {
      const fsMkdirSync = sinon.stub(fs, 'mkdirSync');
      const fsWriteFileSync = sinon.stub(fs, 'writeFileSync');

      fsWriteFileSync.throws('unable to write file');

      const outLog = [];
      const fake = chunk => outLog.push(chunk);
      sinon.stub(process.stderr, 'write').callsFake(fake);
      sinon.stub(process.stdout, 'write').callsFake(fake);

      runner.run(function () {
        sinon.restore();
        expect(
          fsMkdirSync.calledWith(expectedDirName, {recursive: true}),
          'to be true'
        );
        expect(fsWriteFileSync.calledOnce, 'to be true');
        expect(
          outLog[0],
          'to contain',
          `[mocha] writing output to "${expectedFileName}" failed:`
        );
        expect(outLog[1], 'to match', /"fullTitle": "JSON suite json test 1"/);
        done();
      });
    });

    it('should throw "unsupported error" in browser', function () {
      sinon.stub(utils, 'isBrowser').callsFake(() => true);
      expect(
        () => new JSONReporter(runner, options),
        'to throw',
        'file output not supported in browser'
      );
    });
  });
});
