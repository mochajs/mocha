'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Min = reporters.Min;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;

describe('Min reporter', function () {
  const runReporter = makeRunReporter(Min);
  const noop = function () {};

  describe('event handlers', function () {
    describe("on 'start' event", function () {
      it('should clear screen then set cursor position', function () {
        const runner = createMockRunner('start', EVENT_RUN_BEGIN);
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        const stdout = runReporter(fakeThis, runner, options);

        const expectedArray = ['\u001b[2J', '\u001b[1;3H'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'end' event", function () {
      it('should call epilogue', function () {
        const fakeThis = {
          epilogue: sinon.stub().callsFake(noop)
        };
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.epilogue.called, 'to be true');
      });
    });
  });
});
