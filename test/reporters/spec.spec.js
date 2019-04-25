'use strict';

var reporters = require('../../').reporters;
var Spec = reporters.Spec;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Spec reporter', function() {
  var runner;
  var options = {};
  var runReporter = makeRunReporter(Spec);
  var useColors;
  var expectedTitle = 'expectedTitle';

  beforeEach(function() {
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function() {
    Base.useColors = useColors;
    runner = undefined;
  });

  describe('on suite', function() {
    it('should return title', function() {
      var suite = {
        title: expectedTitle
      };
      runner = createMockRunner('suite', 'suite', null, null, suite);
      var stdout = runReporter({epilogue: function() {}}, runner, options);
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
      var stdout = runReporter({epilogue: function() {}}, runner, options);
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
        var stdout = runReporter({epilogue: function() {}}, runner, options);
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
        var stdout = runReporter({epilogue: function() {}}, runner, options);
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
      var stdout = runReporter({epilogue: function() {}}, runner, options);
      var expectedArray = ['  ' + functionCount + ') ' + expectedTitle + '\n'];
      expect(stdout, 'to equal', expectedArray);
    });
  });
});
