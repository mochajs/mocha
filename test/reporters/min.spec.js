'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var Min = reporters.Min;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;

describe('Min reporter', function() {
  var runReporter = makeRunReporter(Min);
  var noop = function() {};

  describe('event handlers', function() {
    describe("on 'start' event", function() {
      it('should clear screen then set cursor position', function() {
        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        var stdout = runReporter(fakeThis, runner, options);

        var expectedArray = ['\u001b[2J', '\u001b[1;3H'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'end' event", function() {
      it('should call epilogue', function() {
        var fakeThis = {
          epilogue: sinon.stub().callsFake(noop)
        };
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.epilogue.called, 'to be true');
      });
    });
  });
});
