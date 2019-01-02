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
    it('should not clear screen or set cursor position', function() {
      runner = createMockRunner('start', 'start');
      var stdout = runReporter({epilogue: function() {}}, runner, options);

      var expectedArray = [];
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
