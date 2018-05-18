'use strict';

var reporters = require('../../').reporters;
var Spec = reporters.Spec;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;

describe('Spec reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;
  var expectedTitle = 'expectedTitle';

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function() {
    Base.useColors = useColors;
    process.stdout.write = stdoutWrite;
  });

  describe('on suite', function() {
    it('should return title', function() {
      var suite = {
        title: expectedTitle
      };
      runner = createMockRunner('suite', 'suite', null, null, suite);
      Spec.call({epilogue: function() {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [expectedTitle + '\n'];
      expect(stdout, 'to equal', expectedArray);
    });
  });
  describe('on pending', function() {
    it('should return title', function() {
      var suite = {
        title: expectedTitle
      };
      runner = createMockRunner('pending test', 'pending', null, null, suite);
      Spec.call({epilogue: function() {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = ['  - ' + expectedTitle + '\n'];
      expect(stdout, 'to equal', expectedArray);
    });
  });
  describe('on pass', function() {
    describe('if test speed is slow', function() {
      it('should return expected tick, title and duration', function() {
        var expectedDuration = 2;
        var test = {
          title: expectedTitle,
          duration: expectedDuration,
          slow: function() {
            return 1;
          }
        };
        runner = createMockRunner('pass', 'pass', null, null, test);
        Spec.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedString =
          '  ' +
          Base.symbols.ok +
          ' ' +
          expectedTitle +
          ' (' +
          expectedDuration +
          'ms)' +
          '\n';
        expect(stdout[0], 'to be', expectedString);
      });
    });
    describe('if test speed is fast', function() {
      it('should return expected tick, title and without a duration', function() {
        var expectedDuration = 1;
        var test = {
          title: expectedTitle,
          duration: expectedDuration,
          slow: function() {
            return 2;
          }
        };
        runner = createMockRunner('pass', 'pass', null, null, test);
        Spec.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedString =
          '  ' + Base.symbols.ok + ' ' + expectedTitle + '\n';
        expect(stdout[0], 'to be', expectedString);
      });
    });
  });
  describe('on fail', function() {
    it('should return title and function count', function() {
      var functionCount = 1;
      var test = {
        title: expectedTitle
      };
      runner = createMockRunner('fail', 'fail', null, null, test);
      Spec.call({epilogue: function() {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = ['  ' + functionCount + ') ' + expectedTitle + '\n'];
      expect(stdout, 'to equal', expectedArray);
    });
  });
});
