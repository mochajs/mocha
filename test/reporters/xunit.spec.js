'use strict';

const EventEmitter = require('node:events').EventEmitter;
const fs = require('node:fs');
const path = require('node:path');
const sinon = require('sinon');
const createStatsCollector = require('../../lib/stats-collector');
const events = require('../../').Runner.constants;
const reporters = require('../../').reporters;
const states = require('../../').Runnable.constants;

const { createTempDir, touchFile } = require('../integration/helpers');

const Base = reporters.Base;
const XUnit = reporters.XUnit;

const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_END = events.EVENT_TEST_END;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

const STATE_FAILED = states.STATE_FAILED;
const STATE_PASSED = states.STATE_PASSED;

describe('XUnit reporter', function () {
  let runner;
  const noop = function () {};

  const expectedLine = 'some-line';
  const expectedClassName = 'fullTitle';
  const expectedTitle = 'some title';
  const expectedFile = 'testFile.spec.js';
  const expectedMessage = 'some message';
  const expectedDiff =
    '\n      + expected - actual\n\n      -foo\n      +bar\n      ';
  const expectedStack = 'some-stack';

  beforeEach(function () {
    runner = { on: noop, once: noop };
    createStatsCollector(runner);
  });

  describe("when 'reporterOptions.output' is provided", function () {
    const expectedOutput = path.join(path.sep, 'path', 'to', 'some-output');
    const options = {
      reporterOptions: {
        output: expectedOutput
      }
    };

    describe('when fileStream can be created', function () {
      let fsMkdirSync;
      let fsCreateWriteStream;

      beforeEach(function () {
        fsMkdirSync = sinon.stub(fs, 'mkdirSync');
        fsCreateWriteStream = sinon.stub(fs, 'createWriteStream');
      });

      it('should open given file for writing, recursively creating directories in pathname', function () {
        const fakeThis = {
          fileStream: null
        };
        XUnit.call(fakeThis, runner, options);

        const expectedDirectory = path.dirname(expectedOutput);
        expect(
          fsMkdirSync.calledWith(expectedDirectory, {
            recursive: true
          }),
          'to be true'
        );

        expect(fsCreateWriteStream.calledWith(expectedOutput), 'to be true');
      });

      afterEach(function () {
        sinon.restore();
      });
    });

    describe('when fileStream cannot be created', function () {
      describe('when given an invalid pathname', function () {
        /**
         * @type {string}
         */
        let tmpdir;

        /**
         * @type {import('../integration/helpers').RemoveTempDirCallback}
         */
        let cleanup;
        let invalidPath;

        beforeEach(async function () {
          const { dirpath, removeTempDir } = await createTempDir();
          tmpdir = dirpath;
          cleanup = removeTempDir;

          // Create path where file 'some-file' used as directory
          invalidPath = path.join(
            tmpdir,
            'some-file',
            path.basename(expectedOutput)
          );
          touchFile(path.dirname(invalidPath));
        });

        it('should throw system error', function () {
          const options = {
            reporterOptions: {
              output: invalidPath
            }
          };
          const boundXUnit = XUnit.bind({}, runner, options);
          expect(
            boundXUnit,
            'to throw',
            expect.it('to be an', Error).and('to satisfy', {
              syscall: 'mkdir',
              code: 'EEXIST',
              path: path.dirname(invalidPath)
            })
          );
        });

        afterEach(function () {
          cleanup();
        });
      });

      describe('when run in browser', function () {
        beforeEach(function () {
          sinon.stub(fs, 'createWriteStream').value(false);
        });

        it('should throw unsupported error', function () {
          const boundXUnit = XUnit.bind({}, runner, options);
          expect(
            boundXUnit,
            'to throw',
            'file output not supported in browser'
          );
        });

        afterEach(function () {
          sinon.restore();
        });
      });
    });
  });

  describe('event handlers', function () {
    describe("on 'pending', 'pass' and 'fail' events", function () {
      it("should add test to tests called on 'end' event", function () {
        const pendingTest = {
          name: 'pending',
          slow: noop
        };
        const failTest = {
          name: 'fail',
          slow: noop
        };
        const passTest = {
          name: 'pass',
          slow: noop
        };
        runner.on = runner.once = function (event, callback) {
          if (event === EVENT_TEST_PENDING) {
            callback(pendingTest);
          } else if (event === EVENT_TEST_PASS) {
            callback(passTest);
          } else if (event === EVENT_TEST_FAIL) {
            callback(failTest);
          } else if (event === EVENT_RUN_END) {
            callback();
          }
        };

        const calledTests = [];
        const fakeThis = {
          write: noop,
          test: function (test) {
            calledTests.push(test);
          }
        };
        XUnit.call(fakeThis, runner);

        const expectedCalledTests = [pendingTest, passTest, failTest];
        expect(calledTests, 'to equal', expectedCalledTests);
      });
    });
  });

  describe('#done', function () {
    let xunit;
    const options = {
      reporterOptions: {}
    };
    const expectedNFailures = 13;
    let callback;

    beforeEach(function () {
      callback = sinon.spy();
    });

    afterEach(function () {
      callback = null;
      xunit = null;
      sinon.restore();
    });

    describe('when output directed to file', function () {
      let fakeThis;

      beforeEach(function () {
        xunit = new XUnit(runner, options);

        fakeThis = {
          fileStream: {
            end: sinon.stub().callsFake(function (chunk, encoding, cb) {
              if (typeof arguments[0] === 'function') {
                cb = arguments[0];
              }
              cb();
            }),
            write: function (chunk, encoding, cb) {}
          }
        };
      });

      it("should run completion callback via 'fileStream.end'", function () {
        xunit.done.call(fakeThis, expectedNFailures, callback);

        expect(fakeThis.fileStream.end.calledOnce, 'to be true');
        expect(callback.calledOnce, 'to be true');
        expect(callback.calledWith(expectedNFailures), 'to be true');
      });
    });

    describe('when output directed to stdout (or console)', function () {
      let fakeThis;

      beforeEach(function () {
        xunit = new XUnit(runner, options);
        fakeThis = {};
      });

      it('should run completion callback', function () {
        xunit.done.call(fakeThis, expectedNFailures, callback);

        expect(callback.calledOnce, 'to be true');
        expect(callback.calledWith(expectedNFailures), 'to be true');
      });
    });
  });

  describe('#write', function () {
    // :TODO: Method should be named 'writeln', not 'write'
    describe('when output directed to file', function () {
      const fileStream = {
        write: sinon.spy()
      };

      it("should call 'fileStream.write' with line and newline", function () {
        const xunit = new XUnit(runner);
        const fakeThis = { fileStream };
        xunit.write.call(fakeThis, expectedLine);

        expect(fileStream.write.calledWith(expectedLine + '\n'), 'to be true');
      });
    });

    describe('when output directed to stdout', function () {
      it("should call 'process.stdout.write' with line and newline", function () {
        const xunit = new XUnit(runner);
        const fakeThis = { fileStream: false };
        const stdoutWriteStub = sinon.stub(process.stdout, 'write');
        xunit.write.call(fakeThis, expectedLine);
        stdoutWriteStub.restore();

        expect(stdoutWriteStub.calledWith(expectedLine + '\n'), 'to be true');
      });
    });

    describe('when output directed to console', function () {
      it("should call 'Base.consoleLog' with line", function () {
        // :TODO: XUnit needs a trivially testable means to force console.log()
        const realProcess = process;
        process = false; // eslint-disable-line no-global-assign

        const xunit = new XUnit(runner);
        const fakeThis = { fileStream: false };
        const consoleLogStub = sinon.stub(Base, 'consoleLog');
        xunit.write.call(fakeThis, expectedLine);
        consoleLogStub.restore();

        process = realProcess; // eslint-disable-line no-global-assign

        expect(consoleLogStub.calledWith(expectedLine), 'to be true');
      });
    });
  });

  describe('#test', function () {
    let expectedWrite;
    const fakeThis = {
      write: function (str) {
        expectedWrite = str;
      }
    };

    beforeEach(function () {
      sinon.stub(Base, 'useColors').value(false);
    });

    afterEach(function () {
      sinon.restore();
      expectedWrite = null;
    });

    describe('on test failure', function () {
      it('should write expected tag with error details', function () {
        const xunit = new XUnit(runner);
        const expectedTest = {
          state: STATE_FAILED,
          title: expectedTitle,
          file: expectedFile,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: 1000,
          err: {
            actual: 'foo',
            expected: 'bar',
            message: expectedMessage,
            stack: expectedStack
          }
        };

        xunit.test.call(fakeThis, expectedTest);
        sinon.restore();

        const expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" file="' +
          expectedFile +
          '" time="1"><failure>' +
          expectedMessage +
          '\n' +
          expectedDiff +
          '\n' +
          expectedStack +
          '</failure></testcase>';
        expect(expectedWrite, 'to be', expectedTag);
      });

      it('should handle non-string diff values', function () {
        const runner = new EventEmitter();
        createStatsCollector(runner);
        const xunit = new XUnit(runner);

        const expectedTest = {
          state: STATE_FAILED,
          title: expectedTitle,
          file: expectedFile,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: 1000,
          err: {
            actual: 1,
            expected: 2,
            message: expectedMessage,
            stack: expectedStack
          }
        };

        sinon.stub(xunit, 'write').callsFake(function (str) {
          expectedWrite += str;
        });

        runner.emit(EVENT_TEST_FAIL, expectedTest, expectedTest.err);
        runner.emit(EVENT_RUN_END);
        sinon.restore();

        const expectedDiff =
          '\n      + expected - actual\n\n      -1\n      +2\n      ';

        expect(expectedWrite, 'to contain', expectedDiff);
      });
    });

    describe('on test pending', function () {
      it('should write expected tag', function () {
        const xunit = new XUnit(runner);
        const expectedTest = {
          isPending: function () {
            return true;
          },
          title: expectedTitle,
          file: expectedFile,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: 1000
        };

        xunit.test.call(fakeThis, expectedTest);
        sinon.restore();

        const expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" file="' +
          expectedFile +
          '" time="1"><skipped/></testcase>';
        expect(expectedWrite, 'to be', expectedTag);
      });
    });

    describe('on test in any other state', function () {
      it('should write expected tag', function () {
        const xunit = new XUnit(runner);
        const expectedTest = {
          isPending: function () {
            return false;
          },
          title: expectedTitle,
          file: expectedFile,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: false
        };

        xunit.test.call(fakeThis, expectedTest);
        sinon.restore();

        const expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" file="' +
          expectedFile +
          '" time="0"/>';
        expect(expectedWrite, 'to be', expectedTag);
      });
    });

    it('should write expected summary statistics', function () {
      let numTests = 0;
      let numPass = 0;
      let numFail = 0;
      const simpleError = {
        actual: 'foo',
        expected: 'bar',
        message: expectedMessage,
        stack: expectedStack
      };
      const generateTest = function (passed) {
        numTests++;
        if (passed) {
          numPass++;
        } else {
          numFail++;
        }
        return {
          title: [expectedTitle, numTests].join(': '),
          state: passed ? STATE_PASSED : STATE_FAILED,
          isPending: function () {
            return false;
          },
          slow: function () {
            return false;
          },
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: 1000
        };
      };

      const runner = new EventEmitter();
      createStatsCollector(runner);
      const xunit = new XUnit(runner);
      expectedWrite = '';
      sinon.stub(xunit, 'write').callsFake(function (str) {
        expectedWrite += str;
      });

      // 3 tests, no failures (i.e. tests that could not run), and 2 errors
      runner.emit(EVENT_TEST_PASS, generateTest(true));
      runner.emit(EVENT_TEST_END);
      runner.emit(EVENT_TEST_FAIL, generateTest(false), simpleError);
      runner.emit(EVENT_TEST_END);
      runner.emit(EVENT_TEST_FAIL, generateTest(false), simpleError);
      runner.emit(EVENT_TEST_END);
      runner.emit(EVENT_RUN_END);

      sinon.restore();

      const expectedNumPass = 1;
      const expectedNumFail = 2;
      const expectedNumTests = 3;

      expect(expectedNumPass, 'to be', numPass);
      expect(expectedNumFail, 'to be', numFail);
      expect(expectedNumTests, 'to be', numTests);

      // :NOTE: Mocha test "fail" is an XUnit "error"
      const expectedTag =
        '<testsuite name="Mocha Tests" tests="3" failures="0" errors="2" skipped="0"';

      expect(expectedWrite, 'to contain', expectedTag);
      expect(expectedWrite, 'to contain', '</testsuite>');
    });
  });

  describe('suite name', function () {
    // Capture the events that the reporter subscribes to
    let events = {};
    // Capture output lines (will contain the resulting XML of XUnit reporter)
    let lines = [];
    // File stream into which the XUnit reporter will write
    let fileStream;

    before(function () {
      fileStream = {
        write: function (chunk, encoding, cb) {
          lines.push(chunk);
        }
      };
    });

    beforeEach(function () {
      lines = [];
      events = {};

      runner.on = runner.once = function (eventName, eventHandler) {
        // Capture the event handler
        events[eventName] = eventHandler;
      };
    });

    it('should use custom name if provided via reporter options', function () {
      const customSuiteName = 'Mocha Is Great!';
      const options = {
        reporterOptions: {
          suiteName: customSuiteName
        }
      };

      const xunit = new XUnit(runner, options);
      xunit.fileStream = fileStream;

      // Trigger end event to force XUnit reporter to write its output
      events[EVENT_RUN_END]();

      expect(lines[0], 'to contain', customSuiteName);
    });

    it('should use default name otherwise', function () {
      const defaultSuiteName = 'Mocha Tests';
      const options = {
        reporterOptions: {}
      };

      const xunit = new XUnit(runner, options);
      xunit.fileStream = fileStream;

      // Trigger end event to force XUnit reporter to write its output
      events[EVENT_RUN_END]();

      expect(lines[0], 'to contain', defaultSuiteName);
    });
  });
});
