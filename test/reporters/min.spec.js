'use strict';

var reporters = require('../../').reporters;
var Min = reporters.Min;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Min reporter', function() {
  var runner;
  var options = {};
  var runReporter = makeRunReporter(Min);

  afterEach(function() {
    runner = undefined;
  });

  describe('on start', function() {
    it('should clear screen then set cursor position', function() {
      runner = createMockRunner('start', 'start');
      var stdout = runReporter({epilogue: function() {}}, runner, options);

      var expectedArray = ['\u001b[2J', '\u001b[1;3H'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('on end', function() {
    it('should call epilogue', function() {
      var calledEpilogue = false;
      runner = createMockRunner('end', 'end');
      runReporter(
        {
          epilogue: function() {
            calledEpilogue = true;
          }
        },
        runner,
        options
      );

      expect(calledEpilogue, 'to be', true);
    });
  });
});
