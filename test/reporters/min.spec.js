'use strict';

var reporters = require('../../').reporters;
var Min = reporters.Min;

describe('Min reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
  });

  describe('on start', function () {
    it('should clear screen then set cursor position', function () {
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      Min.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\u001b[2J',
        '\u001b[1;3H'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });

  describe('on end', function () {
    it('should call epilogue', function () {
      var calledEpilogue = false;
      runner.on = function (event, callback) {
        if (event === 'end') {
          callback();
        }
      };
      Min.call({
        epilogue: function () {
          calledEpilogue = true;
        }
      }, runner);
      process.stdout.write = stdoutWrite;

      expect(calledEpilogue).to.be(true);
    });
  });
});
