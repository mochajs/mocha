'use strict';

var reporters = require('../../').reporters;
var Spec = reporters.Spec;

describe('Spec reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;
  var ansiColorCodeReset = '\u001b[0m';
  var ansiColorCodeCyan = '\u001b[36m';
  var ansiColorCodeRed = '\u001b[31m';
  var ansiColorCodeGreen = '\u001b[32m';
  var ansiColorCodeGrey = '\u001b[90m';

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
  });

  describe('on suite', function () {
    it('should log title indented in color', function () {
      var expectedTitle = 'expectedTitle';
      var suite = {
        title: expectedTitle
      };
      runner.on = function (event, callback) {
        if (event === 'suite') {
          callback(suite);
        }
      };
      Spec.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        ansiColorCodeReset + expectedTitle + ansiColorCodeReset + '\n'
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });
  describe('on pending', function () {
    it('should log title indented in the color cyan', function () {
      var expectedTitle = 'expectedTitle';
      var suite = {
        title: expectedTitle
      };
      runner.on = function (event, callback) {
        if (event === 'pending') {
          callback(suite);
        }
      };
      Spec.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        ansiColorCodeCyan + '  - ' + expectedTitle + ansiColorCodeReset + '\n'
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });
  describe('on pass', function () {
    describe('if test speed is slow', function () {
      it('should return expected green tick, grey title and with duration colored in red', function () {
        var expectedTitle = 'expectedTitle';
        var expectedDuration = 2;
        var test = {
          title: expectedTitle,
          duration: expectedDuration,
          slow: function () { return 1; }
        };
        runner.on = function (event, callback) {
          if (event === 'pass') {
            callback(test);
          }
        };
        Spec.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedString = ansiColorCodeGreen + '  ✓' + ansiColorCodeReset + ansiColorCodeGrey + ' ' + expectedTitle + ansiColorCodeReset + ansiColorCodeRed + ' (' + expectedDuration + 'ms)' + ansiColorCodeReset + '\n';
        stdout[0].should.equal(expectedString);
      });
    });
    describe('if test speed is fast', function () {
      it('should return expected green tick, grey title and without a duration', function () {
        var expectedTitle = 'expectedTitle';
        var expectedDuration = 1;
        var test = {
          title: expectedTitle,
          duration: expectedDuration,
          slow: function () { return 2; }
        };
        runner.on = function (event, callback) {
          if (event === 'pass') {
            callback(test);
          }
        };
        Spec.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedString = ansiColorCodeGreen + '  ✓' + ansiColorCodeReset + ansiColorCodeGrey + ' ' + expectedTitle + ansiColorCodeReset + '\n';
        stdout[0].should.equal(expectedString);
      });
    });
  });
  describe('on fail', function () {
    it('should log title indented in the color red', function () {
      var expectedTitle = 'expectedTitle';
      var test = {
        title: expectedTitle
      };
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test);
        }
      };
      Spec.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        ansiColorCodeRed + '  1) ' + expectedTitle + ansiColorCodeReset + '\n'
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });
});
