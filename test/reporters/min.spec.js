'use strict';

var reporters = require('../../').reporters;
var Min = reporters.Min;

var createMockRunner = require('./helpers').createMockRunner;

describe('Min reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
  });

  afterEach(function() {
    process.stdout.write = stdoutWrite;
  });

  describe('on start', function() {
    it('should clear screen then set cursor position', function() {
      runner = createMockRunner('start', 'start');
      Min.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;
      var expectedArray = ['\u001b[2J', '\u001b[1;3H'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('on end', function() {
    it('should call epilogue', function() {
      var calledEpilogue = false;
      runner = createMockRunner('end', 'end');
      Min.call(
        {
          epilogue: function() {
            calledEpilogue = true;
          }
        },
        runner
      );
      process.stdout.write = stdoutWrite;

      expect(calledEpilogue, 'to be', true);
    });
  });
});
