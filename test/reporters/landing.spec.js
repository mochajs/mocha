'use strict';

var sandbox = require('sinon').createSandbox();
var Mocha = require('../..');
var reporters = Mocha.reporters;
var Landing = reporters.Landing;
var constants = Mocha.Runnable.constants;
var STATE_FAILED = constants.STATE_FAILED;
var STATE_PASSED = constants.STATE_PASSED;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Landing reporter', function() {
  var runner;
  var options = {};
  var runReporter = makeRunReporter(Landing);
  var resetCode = '\u001b[0m';
  var expectedArray = [
    '\u001b[1D\u001b[2A',
    '  ',
    '\n  ',
    '',
    '✈',
    '\n',
    '  ',
    resetCode
  ];

  beforeEach(function() {
    sandbox.stub(Base, 'useColors').value(false);
    sandbox.stub(Base.window, 'width').value(1);
  });

  afterEach(function() {
    sandbox.restore();
    runner = undefined;
  });

  describe('on start', function() {
    it('should write new lines', function() {
      sandbox.stub(Base.cursor, 'hide');

      runner = createMockRunner('start', 'start');
      var stdout = runReporter({}, runner, options);

      expect(stdout[0], 'to equal', '\n\n\n  ');
    });

    it('should call cursor hide', function() {
      sandbox.stub(Base.cursor, 'hide');

      runner = createMockRunner('start', 'start');
      runReporter({}, runner, options);

      expect(Base.cursor.hide, 'was called');
    });
  });

  describe('on test end', function() {
    describe('if test has failed', function() {
      it('should write expected landing strip', function() {
        var test = {
          state: STATE_FAILED
        };
        runner = createMockRunner('test end', 'test end', null, null, test);
        runner.total = 12;
        var stdout = runReporter({}, runner, options);

        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if test has not failed', function() {
      it('should write expected landing strip', function() {
        var test = {
          state: STATE_PASSED
        };
        runner = createMockRunner('test end', 'test end', null, null, test);

        var stdout = runReporter({}, runner, options);

        expect(stdout, 'to equal', expectedArray);
      });
    });
  });
  describe('on end', function() {
    it('should call cursor show and epilogue', function() {
      var reporterStub = {epilogue: function() {}};
      sandbox.stub(Base.cursor, 'show');
      sandbox.stub(reporterStub, 'epilogue');

      runner = createMockRunner('end', 'end');

      runReporter(reporterStub, runner, options);

      expect(reporterStub.epilogue, 'was called');
      expect(Base.cursor.show, 'was called');
    });
  });
});
