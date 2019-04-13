'use strict';

var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var sinon = require('sinon');
var createStatsCollector = require('../../lib/stats-collector');
var Runner = require('../../lib/runner');
var Runnable = require('../../lib/runnable');
var reporters = require('../../').reporters;
var XUnit = reporters.XUnit;

describe('XUnit reporter', function() {
  var sandbox;
  var runner;
  var noop = function() {};

  var expectedLine = 'some-line';
  var expectedClassName = 'fullTitle';
  var expectedTitle = 'some title';
  var expectedMessage = 'some message';
  var expectedDiff =
    '\n      + expected - actual\n\n      -foo\n      +bar\n      ';
  var expectedStack = 'some-stack';

  beforeEach(function() {
    runner = {on: noop, once: noop};
    createStatsCollector(runner);
  });

  describe("when reporterOptions 'output' is provided", function() {
    var expectedOutput = path.join(path.sep, 'path', 'to', 'some-output');
    var options = {
      reporterOptions: {
        output: expectedOutput
      }
    };

    describe('when fileStream can be created', function() {
      var mkdirpSync;
      var fsCreateWriteStream;

      before(function() {
        sandbox = sinon.createSandbox();
        mkdirpSync = sandbox.stub(mkdirp, 'sync');
        fsCreateWriteStream = sandbox.stub(fs, 'createWriteStream');
      });

      it('should open given file for writing, recursively creating directories in pathname', function() {
        var fakeThis = {
          _fileStream: null
        };
        XUnit.call(fakeThis, runner, options);

        var expectedDirectory = path.dirname(expectedOutput);
        expect(mkdirpSync.calledWith(expectedDirectory), 'to be true');
        expect(fsCreateWriteStream.calledWith(expectedOutput), 'to be true');
      });

      after(function() {
        sandbox.restore();
      });
    });

    describe('when fileStream cannot be created', function() {
      describe('when given an invalid pathname', function() {
        var tmpdir;
        var invalidPath;

        before(function createInvalidPath() {
          tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'mocha-test-'));

          function touch(filename) {
            fs.closeSync(fs.openSync(filename, 'w'));
          }

          // Create path where file 'some-file' used as directory
          invalidPath = path.join(
            tmpdir,
            'some-file',
            path.basename(expectedOutput)
          );
          touch(path.dirname(invalidPath));
          options.reporterOptions.output = invalidPath;
        });

        it('should throw system error', function() {
          var boundXUnit = XUnit.bind({}, runner, options);
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

        after(function cleanUpOnAisle5() {
          rimraf.sync(tmpdir);
          options.reporterOptions.output = expectedOutput;
        });
      });

      describe('when run in browser', function() {
        before(function() {
          sandbox = sinon.createSandbox();
          sandbox.stub(fs, 'createWriteStream').value(false);
        });

        it('should throw unsupported error', function() {
          var boundXUnit = XUnit.bind({}, runner, options);
          expect(
            boundXUnit,
            'to throw',
            'file output not supported in browser'
          );
        });

        after(function() {
          sandbox.restore();
        });
      });
    });
  });

  describe("on 'pending', 'pass' and 'fail' events", function() {
    it("should add test to tests called on 'end' event", function() {
      var pendingTest = {
        name: 'pending',
        slow: noop
      };
      var failTest = {
        name: 'fail',
        slow: noop
      };
      var passTest = {
        name: 'pass',
        slow: noop
      };
      runner.on = runner.once = function(event, callback) {
        if (event === 'pending') {
          callback(pendingTest);
        } else if (event === 'pass') {
          callback(passTest);
        } else if (event === 'fail') {
          callback(failTest);
        } else if (event === 'end') {
          callback();
        }
      };

      var calledTests = [];
      XUnit.call(
        {
          writeln: noop,
          test: function(test) {
            calledTests.push(test);
          }
        },
        runner
      );

      var expectedCalledTests = [pendingTest, passTest, failTest];
      expect(calledTests, 'to equal', expectedCalledTests);
    });
  });

  describe('#done', function() {
    var xunit;
    var options = {
      reporterOptions: {}
    };
    var expectedNFailures = 13;
    var callback;

    beforeEach(function() {
      sandbox = sinon.createSandbox();
      callback = sandbox.spy();
    });

    afterEach(function() {
      callback = null;
      xunit = null;
      sandbox.restore();
    });

    describe('when output directed to fileStream', function() {
      var fakeThis;

      beforeEach(function() {
        xunit = new XUnit(runner, options);

        fakeThis = {
          _fileStream: {
            end: function(chunk, encoding, cb) {
              if (typeof arguments[0] === 'function') {
                cb = arguments[0];
              }
              cb();
            },
            write: function(chunk, encoding, cb) {}
          }
        };
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
        xunit.write.call(fakeThis, ''); // Force adaptation
      });

      it('should run completion callback inside stream end', function() {
        xunit.done.call(fakeThis, expectedNFailures, callback);

        expect(callback.calledOnce, 'to be true');
        expect(callback.calledWith(expectedNFailures), 'to be true');
      });
    });

    describe('when output directed to stdout', function() {
      var fakeThis;

      beforeEach(function() {
        xunit = new XUnit(runner, options);

        fakeThis = {
          preferConsole: false
        };
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
        xunit.write.call(fakeThis, ''); // Force adaptation
      });

      it('should run completion callback', function() {
        xunit.done.call(fakeThis, expectedNFailures, callback);

        expect(callback.calledOnce, 'to be true');
        expect(callback.calledWith(expectedNFailures), 'to be true');
      });
    });

    describe('when output directed to console', function() {
      var fakeThis;

      beforeEach(function() {
        xunit = new XUnit(runner, options);

        fakeThis = {
          preferConsole: true
        };
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
        xunit.write.call(fakeThis, ''); // Force adaptation
      });

      it('should run completion callback inside setTimeout', function() {
        xunit.done.call(fakeThis, expectedNFailures, callback);

        expect(callback.calledOnce, 'to be true');
        expect(callback.calledWith(expectedNFailures), 'to be true');
      });
    });

    describe('when no output occurs', function() {
      var fakeThis;

      beforeEach(function() {
        xunit = new XUnit(runner, options);

        fakeThis = {};
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
      });

      it('should run completion callback directly', function() {
        xunit.done.call(fakeThis, expectedNFailures, callback);

        expect(callback.calledOnce, 'to be true');
        expect(callback.calledWith(expectedNFailures), 'to be true');
      });
    });
  });

  describe('#writeln', function() {
    describe('when output directed to fileStream', function() {
      var xunit;
      var fileStreamWrite;

      before(function() {
        fileStreamWrite = sinon.spy();
      });

      it("should call 'fileStream.write' with line and newline", function() {
        xunit = new XUnit(runner);
        var fileStream = {
          write: fileStreamWrite
        };

        var fakeThis = {_fileStream: fileStream};
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
        xunit.writeln.call(fakeThis, expectedLine);

        expect(fileStreamWrite.calledWith(expectedLine + '\n'), 'to be true');
      });

      after(function() {
        fileStreamWrite = null;
        xunit = null;
      });
    });

    describe('when output directed to stdout', function() {
      var xunit;

      it("should call 'process.stdout.write' with line and newline", function() {
        xunit = new XUnit(runner);

        var fakeThis = {preferConsole: false};
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
        var stdoutWrite = sinon.stub(process.stdout, 'write');
        xunit.writeln.call(fakeThis, expectedLine);
        stdoutWrite.restore();

        expect(stdoutWrite.calledWith(expectedLine + '\n'), 'to be true');
      });
    });

    describe('when output directed to console', function() {
      var xunit;

      it("should call 'console.log' with line", function() {
        xunit = new XUnit(runner);

        var fakeThis = {preferConsole: true};
        Object.setPrototypeOf(fakeThis, XUnit.prototype);
        var consoleLog = sinon.stub(console, 'log');
        xunit.writeln.call(fakeThis, expectedLine);
        consoleLog.restore();

        expect(consoleLog.calledWith(expectedLine), 'to be true');
      });
    });
  });

  describe('#test', function() {
    var EVENT_RUN_END = Runner.constants.EVENT_RUN_END;
    var EVENT_TEST_END = Runner.constants.EVENT_TEST_END;
    var EVENT_TEST_FAIL = Runner.constants.EVENT_TEST_FAIL;
    var EVENT_TEST_PASS = Runner.constants.EVENT_TEST_PASS;
    var STATE_FAILED = Runnable.constants.STATE_FAILED;
    var STATE_PASSED = Runnable.constants.STATE_PASSED;
    var expectedWrite;

    afterEach(function() {
      expectedWrite = null;
    });

    describe('on test failure', function() {
      it('should write expected tag with error details', function() {
        var xunit = new XUnit(runner);
        var expectedTest = {
          state: STATE_FAILED,
          title: expectedTitle,
          parent: {
            fullTitle: function() {
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
        var expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" time="1"><failure>' +
          expectedMessage +
          '\n' +
          expectedDiff +
          '\n' +
          expectedStack +
          '</failure></testcase>';

        xunit.test.call(
          {
            writeln: function(str) {
              expectedWrite = str;
            }
          },
          expectedTest
        );

        expect(expectedWrite, 'to be', expectedTag);
      });
    });

    describe('on test pending', function() {
      it('should write expected tag', function() {
        var xunit = new XUnit(runner);
        var expectedTest = {
          isPending: function() {
            return true;
          },
          title: expectedTitle,
          parent: {
            fullTitle: function() {
              return expectedClassName;
            }
          },
          duration: 1000
        };
        var expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" time="1"><skipped/></testcase>';

        xunit.test.call(
          {
            writeln: function(str) {
              expectedWrite = str;
            }
          },
          expectedTest
        );

        expect(expectedWrite, 'to be', expectedTag);
      });
    });

    describe('on test in any other state', function() {
      it('should write expected tag', function() {
        var xunit = new XUnit({on: noop, once: noop});
        var expectedTest = {
          isPending: function() {
            return false;
          },
          title: expectedTitle,
          parent: {
            fullTitle: function() {
              return expectedClassName;
            }
          },
          duration: false
        };
        var expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" time="0"/>';

        xunit.test.call(
          {
            writeln: function(str) {
              expectedWrite = str;
            }
          },
          expectedTest
        );

        expect(expectedWrite, 'to be', expectedTag);
      });
    });

    it('should write expected summary statistics', function() {
      var count = 0;
      var simpleError = {
        actual: 'foo',
        expected: 'bar',
        message: expectedMessage,
        stack: expectedStack
      };
      var generateTest = function(passed) {
        var t = {
          title: expectedTitle + count,
          state: passed ? STATE_PASSED : STATE_FAILED,
          isPending: function() {
            return false;
          },
          slow: function() {
            return false;
          },
          parent: {
            fullTitle: function() {
              return expectedClassName;
            }
          },
          duration: 1000
        };
        return t;
      };

      var runner = new EventEmitter();
      createStatsCollector(runner);
      var xunit = new XUnit(runner);
      expectedWrite = '';
      xunit.writeln = function(str) {
        expectedWrite += str;
      };

      // 3 tests, no failures (i.e. tests that could not run), and 2 errors
      runner.emit(EVENT_TEST_END);
      runner.emit(EVENT_TEST_PASS, generateTest(true));
      runner.emit(EVENT_TEST_END);
      runner.emit(EVENT_TEST_FAIL, generateTest(false), simpleError);
      runner.emit(EVENT_TEST_END);
      runner.emit(EVENT_TEST_FAIL, generateTest(false), simpleError);
      runner.emit(EVENT_RUN_END);

      var expectedTag =
        '<testsuite name="Mocha Tests" tests="3" failures="0" errors="2" skipped="0"';

      expect(expectedWrite, 'to contain', expectedTag);
      expect(expectedWrite, 'to contain', '</testsuite>');
    });
  });

  describe('suite name', function() {
    // Capture the events that the reporter subscribes to
    var events = {};
    // Capture output lines (will contain the resulting XML of XUnit reporter)
    var lines = [];
    // File stream into which the XUnit reporter will write
    var fileStream;

    before(function() {
      fileStream = {
        write: function(chunk, encoding, cb) {
          // Capture the output lines
          lines.push(chunk);
        }
      };
    });

    beforeEach(function() {
      lines = [];
      events = {};

      runner.on = runner.once = function(eventName, eventHandler) {
        // Capture the event handler
        events[eventName] = eventHandler;
      };
    });

    it('should use default name if custom name not provided', function() {
      var defaultSuiteName = 'Mocha Tests';
      var options = {
        reporterOptions: {}
      };

      var xunit = new XUnit(runner, options);
      xunit._fileStream = fileStream;

      // Trigger end event to force XUnit reporter to write its output
      events['end']();

      expect(lines[0], 'to contain', defaultSuiteName);
    });

    it('should use custom name if provided via reporter options', function() {
      var customSuiteName = 'Mocha Is Great!';
      var options = {
        reporterOptions: {
          suiteName: customSuiteName
        }
      };

      var xunit = new XUnit(runner, options);
      xunit._fileStream = fileStream;

      // Trigger end event to force XUnit reporter to write its output
      events['end']();

      expect(lines[0], 'to contain', customSuiteName);
    });
  });
});
