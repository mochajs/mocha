'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var assert = require('assert');
var reporters = require('../../').reporters;
var XUnit = reporters.XUnit;

describe('XUnit reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;

  var callbackArgument = null;
  var expectedFailure = 'some-failures';
  var expectedLine = 'some-line';
  var expectedClassName = 'fullTitle';
  var expectedTitle = 'some title';
  var expectedMessage = 'some message';
  var expectedStack = 'some-stack';
  var expectedWrite = null;

  beforeEach(function() {
    stdout = [];
    runner = {on: function() {}, once: function() {}};
  });

  describe('if reporter options output is given', function() {
    var expectedOutput = 'some-output';
    var options = {
      reporterOptions: {
        output: expectedOutput
      }
    };
    describe('but it cant create a write stream', function() {
      it('should throw expected error', function() {
        var fsCreateWriteStream = fs.createWriteStream;
        fs.createWriteStream = false;

        var boundXUnit = XUnit.bind({}, runner, options);
        expect(boundXUnit, 'to throw', 'file output not supported in browser');
        fs.createWriteStream = fsCreateWriteStream;
      });
    });
    describe('and it can create a write stream', function() {
      it('should locate the output dir, create it, then assign as fileStream', function() {
        var expectedDirectory;
        var mkdirpSync = mkdirp.sync;
        var pathDirname = path.dirname;
        var fsCreateWriteStream = fs.createWriteStream;
        mkdirp.sync = function(directory) {
          expectedDirectory = directory;
        };
        path.dirname = function(location) {
          return location;
        };
        fs.createWriteStream = function(streamDetails) {
          return streamDetails;
        };

        var contextVariables = {
          fileStream: null
        };
        XUnit.call(contextVariables, runner, options);

        expect(expectedDirectory, 'to be', expectedOutput);
        expect(contextVariables.fileStream, 'to be', expectedOutput);

        fs.createWriteStream = fsCreateWriteStream;
        mkdirp.sync = mkdirpSync;
        path.dirname = pathDirname;
      });
    });
  });

  describe("on 'pending', 'pass' and 'fail' events", function() {
    it("should add test to tests called on 'end' event", function() {
      var pendingTest = {
        name: 'pending',
        slow: function() {}
      };
      var failTest = {
        name: 'fail',
        slow: function() {}
      };
      var passTest = {
        name: 'pass',
        slow: function() {}
      };
      runner.on = runner.once = function(event, callback) {
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
      XUnit.call(
        {
          write: function() {},
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

  describe('done', function() {
    describe('if fileStream is truthly', function() {
      it('should run callback with failure inside streams end', function() {
        var xunit = new XUnit({on: function() {}, once: function() {}});
        var callback = function(failures) {
          callbackArgument = failures;
        };
        var calledEnd = false;
        var fileStream = {
          end: function(callback) {
            calledEnd = true;
            callback();
          }
        };
        xunit.done.call({fileStream: fileStream}, expectedFailure, callback);

        expect(calledEnd, 'to be', true);
        expect(callbackArgument, 'to be', expectedFailure);
      });
    });
    describe('if fileStream is falsy', function() {
      it('should run callback with failure', function() {
        var xunit = new XUnit({on: function() {}, once: function() {}});
        var callback = function(failures) {
          callbackArgument = failures;
        };
        xunit.done.call({fileStream: false}, expectedFailure, callback);

        expect(callbackArgument, 'to be', expectedFailure);
      });
    });
  });

  describe('write', function() {
    describe('if fileStream is truthly', function() {
      it('should call fileStream write with line and new line', function() {
        var xunit = new XUnit({on: function() {}, once: function() {}});
        var fileStream = {
          write: function(write) {
            expectedWrite = write;
          }
        };
        xunit.write.call({fileStream: fileStream}, expectedLine);

        expect(expectedWrite, 'to be', expectedLine + '\n');
      });
    });
    describe('if fileStream is falsy and stdout exists', function() {
      it('should call write with line and new line', function() {
        stdoutWrite = process.stdout.write;
        process.stdout.write = function(string) {
          stdout.push(string);
        };

        var xunit = new XUnit({on: function() {}, once: function() {}});
        xunit.write.call({fileStream: false}, expectedLine);

        process.stdout.write = stdoutWrite;

        expect(stdout[0], 'to be', expectedLine + '\n');
      });
    });
    describe('if fileStream is falsy and stdout does not exist', function() {
      it('should call write with line', function() {
        stdoutWrite = process;
        process = false; // eslint-disable-line no-native-reassign, no-global-assign
        var cachedConsoleLog = console.log;
        console.log = function(string) {
          stdout.push(string);
        };

        var xunit = new XUnit({on: function() {}, once: function() {}});
        xunit.write.call({fileStream: false}, expectedLine);

        console.log = cachedConsoleLog;
        process = stdoutWrite; // eslint-disable-line no-native-reassign, no-global-assign
        expect(stdout[0], 'to be', expectedLine);
      });
    });
  });

  describe('test', function() {
    describe('on test failure', function() {
      it('should write expected tag with error details', function() {
        var xunit = new XUnit({on: function() {}, once: function() {}});
        var expectedTest = {
          state: 'failed',
          title: expectedTitle,
          parent: {
            fullTitle: function() {
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
            write: function(string) {
              expectedWrite = string;
            }
          },
          expectedTest
        );

        var expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" time="1"><failure>' +
          expectedMessage +
          '\n' +
          expectedStack +
          '</failure></testcase>';

        expect(expectedWrite, 'to be', expectedTag);
      });
    });
    describe('on test pending', function() {
      it('should write expected tag', function() {
        var xunit = new XUnit({on: function() {}, once: function() {}});

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
        xunit.test.call(
          {
            write: function(string) {
              expectedWrite = string;
            }
          },
          expectedTest
        );

        var expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" time="1"><skipped/></testcase>';

        expect(expectedWrite, 'to be', expectedTag);
      });
    });
    describe('on test in any other state', function() {
      it('should write expected tag', function() {
        var xunit = new XUnit({on: function() {}, once: function() {}});

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
        xunit.test.call(
          {
            write: function(string) {
              expectedWrite = string;
            }
          },
          expectedTest
        );

        var expectedTag =
          '<testcase classname="' +
          expectedClassName +
          '" name="' +
          expectedTitle +
          '" time="0"/>';

        expect(expectedWrite, 'to be', expectedTag);
      });
    });
  });

  describe('custom suite name', function() {
    // capture the events that the reporter subscribes to
    var events;
    // the runner parameter of the reporter
    var runner;
    // capture output lines (will contain the resulting XML of the xunit reporter)
    var lines;
    // the file stream into which the xunit reporter will write into
    var fileStream;

    beforeEach(function() {
      events = {};

      runner = {
        on: function(eventName, eventHandler) {
          // capture the event handler
          events[eventName] = eventHandler;
        }
      };
      runner.once = runner.on;

      lines = [];
      fileStream = {
        write: function(line) {
          // capture the output lines
          lines.push(line);
        }
      };
    });

    it('should use "Mocha Tests" as the suite name if no custom name is provided', function() {
      // arrange
      var xunit = new XUnit(runner);
      xunit.fileStream = fileStream;

      // act (trigger the end event to force xunit reporter to write the output)
      events['end']();

      // assert
      assert(
        lines[0].indexOf('Mocha Tests') >= 0,
        'it should contain the text "Mocha Tests"'
      );
    });

    it('should use the custom suite name as the suite name when provided in the reporter options', function() {
      // arrange
      var options = {
        reporterOptions: {
          // this time, with a custom suite name
          suiteName: 'Mocha Is Great!'
        }
      };

      var xunit = new XUnit(runner, options);
      xunit.fileStream = fileStream;

      // act (trigger the end event to force xunit reporter to write the output)
      events['end']();

      // assert
      assert(
        lines[0].indexOf('<testsuite name="Mocha Is Great!"') === 0,
        '"' + lines[0] + '" should contain the text "Mocha Is Great"'
      );
    });
  });
});
