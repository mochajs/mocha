'use strict';

var reporters = require('../../').reporters;
var Spec = reporters.Spec;
var Base = reporters.Base;

var runnerEvent = require('./helpers').runnerEvent;

describe('Spec reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;
  var expectedTitle = 'expectedTitle';

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function () {
    Base.useColors = useColors;
  });

  describe('on suite', function () {
    it('should return title', function () {
      var suite = {
        title: expectedTitle
      };
      runner.on = runner.once = runnerEvent('suite', 'suite', null, null, suite);
      Spec.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        expectedTitle + '\n'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });
  describe('on pending', function () {
    it('should return title', function () {
      var suite = {
        title: expectedTitle
      };
      runner.on = runner.once = runnerEvent('pending test', 'pending', null, null, suite);
      Spec.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '  - ' + expectedTitle + '\n'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });
  describe('on pass', function () {
    describe('if test speed is slow', function () {
      it('should return expected tick, title and duration', function () {
        var expectedDuration = 2;
        var test = {
          title: expectedTitle,
          duration: expectedDuration,
          slow: function () { return 1; }
        };
        runner.on = runner.once = function (event, callback) {
          if (event === 'pass') {
            callback(test);
          }
        };
        Spec.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedString = '  ' + Base.symbols.ok + ' ' + expectedTitle + ' (' + expectedDuration + 'ms)' + '\n';
        expect(stdout[0]).to.equal(expectedString);
      });
    });
    describe('if test speed is fast', function () {
      it('should return expected tick, title and without a duration', function () {
        var expectedDuration = 1;
        var test = {
          title: expectedTitle,
          duration: expectedDuration,
          slow: function () { return 2; }
        };
        runner.on = runner.once = function (event, callback) {
          if (event === 'pass') {
            callback(test);
          }
        };
        Spec.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedString = '  ' + Base.symbols.ok + ' ' + expectedTitle + '\n';
        expect(stdout[0]).to.equal(expectedString);
      });
    });
  });
  describe('on fail', function () {
    it('should return title and function count', function () {
      var functionCount = 1;
      var test = {
        title: expectedTitle
      };
      runner.on = runner.once = runnerEvent('fail', 'fail', null, null, test);
      Spec.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '  ' + functionCount + ') ' + expectedTitle + '\n'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });
});
