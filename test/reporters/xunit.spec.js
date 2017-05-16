'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var reporters = require('../../').reporters;
var XUnit = reporters.XUnit;

describe('XUnit reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;

  beforeEach(function () {
    stdout = [];
    runner = {
      on: function () {}
    };
  });

  describe('if reporter options output is given', function () {
    var expectedOutput = 'some-output';
    var options = {
      reporterOptions: {
        output: expectedOutput
      }
    };
    describe('but it cant create a write stream', function () {
      it('should throw expected error', function () {
        var fsCreateWriteStream = fs.createWriteStream;
        fs.createWriteStream = false;

        var boundXUnit = XUnit.bind({}, runner, options);
        boundXUnit.should.throw('file output not supported in browser');
        fs.createWriteStream = fsCreateWriteStream;
      });
    });
    describe('and it can create a write stream', function () {
      it('should locate the output dir, create it, then assign as fileStream', function () {
        var expectedDirectory;
        var mkdirpSync = mkdirp.sync;
        var pathDirname = path.dirname;
        var fsCreateWriteStream = fs.createWriteStream;
        mkdirp.sync = function (directory) { expectedDirectory = directory; };
        path.dirname = function (location) { return location; };
        fs.createWriteStream = function (streamDetails) { return streamDetails; };

        var contextVariables = {
          fileStream: null
        };
        XUnit.call(contextVariables, runner, options);

        expectedDirectory.should.equal(expectedOutput);
        contextVariables.fileStream.should.equal(expectedOutput);

        fs.createWriteStream = fsCreateWriteStream;
        mkdirp.sync = mkdirpSync;
        path.dirname = pathDirname;
      });
    });
  });

  describe('on \'pending\', \'pass\' and \'fail\' events', function () {
    it('should add test to tests called on \'end\' event', function () {
      var pendingTest = {
        name: 'pending',
        slow: function () {}
      };
      var failTest = {
        name: 'fail',
        slow: function () {}
      };
      var passTest = {
        name: 'pass',
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'pending') {
          callback(pendingTest);
        }
        if (event === 'pass') {
          callback(passTest);
        }
        if (event === 'fail') {
          callback(failTest);
        }
        if (event === 'end') {
          callback();
        }
      };

      var calledTests = [];
      XUnit.call({
        write: function () {},
        test: function (test) {
          calledTests.push(test);
        }
      }, runner);

      var expectedCalledTests = [
        pendingTest,
        passTest,
        failTest
      ];
      calledTests.should.deepEqual(expectedCalledTests);
    });
  });

  describe('done', function () {
    describe('if fileStream is truthly', function () {
      it('should run callback with failure inside streams end', function () {
        var xunit = new XUnit({on: function () {}});
        var callbackArgument = null;
        var callback = function (failures) {
          callbackArgument = failures;
        };
        var calledEnd = false;
        var expectedFailure = 'some-failures';
        var fileStream = {
          end: function (callback) {
            calledEnd = true;
            callback();
          }
        };
        xunit.done.call(
          { fileStream: fileStream },
          expectedFailure,
          callback
        );

        calledEnd.should.be.true();
        callbackArgument.should.equal(expectedFailure);
      });
    });
    describe('if fileStream is falsy', function () {
      it('should run callback with failure', function () {
        var xunit = new XUnit({on: function () {}});
        var callbackArgument = null;
        var callback = function (failures) {
          callbackArgument = failures;
        };
        var expectedFailure = 'some-failures';
        xunit.done.call(
          { fileStream: false },
          expectedFailure,
          callback
        );

        callbackArgument.should.equal(expectedFailure);
      });
    });
  });

  describe('write', function () {
    describe('if fileStream is truthly', function () {
      it('should call fileStream write with line and new line', function () {
        var expectedWrite = null;
        var xunit = new XUnit({on: function () {}});
        var fileStream = {
          write: function (write) {
            expectedWrite = write;
          }
        };
        var expectedLine = 'some-line';
        xunit.write.call(
          { fileStream: fileStream },
          expectedLine
        );

        expectedWrite.should.equal(expectedLine + '\n');
      });
    });
    describe('if fileStream is falsy and stdout exists', function () {
      it('should call write with line and new line', function () {
        stdoutWrite = process.stdout.write;
        process.stdout.write = function (string) {
          stdout.push(string);
        };

        var xunit = new XUnit({on: function () {}});
        var expectedLine = 'some-line';
        xunit.write.call(
          { fileStream: false },
          expectedLine
        );

        process.stdout.write = stdoutWrite;

        stdout[0].should.equal(expectedLine + '\n');
      });
    });
    describe('if fileStream is falsy and stdout does not exist', function () {
      it('should call write with line', function () {
        stdoutWrite = process;
        process = false; // eslint-disable-line no-native-reassign, no-global-assign
        var cachedConsoleLog = console.log;
        console.log = function (string) {
          stdout.push(string);
        };

        var xunit = new XUnit({on: function () {}});
        var expectedLine = 'some-line';
        xunit.write.call(
          { fileStream: false },
          expectedLine
        );

        console.log = cachedConsoleLog;
        process = stdoutWrite; // eslint-disable-line no-native-reassign, no-global-assign
        stdout[0].should.equal(expectedLine);
      });
    });
  });

  describe('test', function () {
    describe('on test failure', function () {
      it('should write expected tag with error details', function () {
        var xunit = new XUnit({on: function () {}});

        var expectedWrite = null;
        var expectedClassName = 'fullTitle';
        var expectedTitle = 'some title';
        var expectedMessage = 'some message';
        var expectedStack = 'some-stack';
        var expectedTest = {
          state: 'failed',
          title: expectedTitle,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: 1000,
          err: {
            message: expectedMessage,
            stack: expectedStack
          }
        };
        xunit.test.call(
          {
            write: function (string) {
              expectedWrite = string;
            }
          },
          expectedTest
        );

        var expectedTag = '<testcase classname="' + expectedClassName + '" name="' + expectedTitle + '" time="1"><failure>' + expectedMessage + '\n' + expectedStack + '</failure></testcase>';

        expectedWrite.should.equal(expectedTag);
      });
    });
    describe('on test pending', function () {
      it('should write expected tag', function () {
        var xunit = new XUnit({on: function () {}});

        var expectedClassName = 'fullTitle';
        var expectedTitle = 'some title';
        var expectedTest = {
          isPending: function () { return true; },
          title: expectedTitle,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: 1000
        };
        var expectedWrite = null;
        xunit.test.call(
          {
            write: function (string) {
              expectedWrite = string;
            }
          },
          expectedTest
        );

        var expectedTag = '<testcase classname="' + expectedClassName + '" name="' + expectedTitle + '" time="1"><skipped/></testcase>';

        expectedWrite.should.equal(expectedTag);
      });
    });
    describe('on test in any other state', function () {
      it('should write expected tag', function () {
        var xunit = new XUnit({on: function () {}});

        var expectedClassName = 'fullTitle';
        var expectedTitle = 'some title';
        var expectedTest = {
          isPending: function () { return false; },
          title: expectedTitle,
          parent: {
            fullTitle: function () {
              return expectedClassName;
            }
          },
          duration: false
        };
        var expectedWrite = null;
        xunit.test.call(
          {
            write: function (string) {
              expectedWrite = string;
            }
          },
          expectedTest
        );

        var expectedTag = '<testcase classname="' + expectedClassName + '" name="' + expectedTitle + '" time="0"/>';

        expectedWrite.should.equal(expectedTag);
      });
    });
  });
});
