'use strict';

var sandbox = require('sinon').createSandbox();
var reporters = require('../../').reporters;
var Progress = reporters.Progress;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Progress reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;
  var runReporter = makeRunReporter(Progress);

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
  });

  afterEach(function() {
    sandbox.restore();
    process.stdout.write = stdoutWrite;
  });

  describe('on start', function() {
    it('should call cursor hide', function() {
      sandbox.stub(Base.cursor, 'hide');

      runner = createMockRunner('start', 'start');
      runReporter({}, runner, {});

      expect(Base.cursor.hide, 'was called');
    });
  });

  describe('on test end', function() {
    describe('if line has not changed', function() {
      it('should return and not write anything', function() {
        sandbox.stub(Base, 'useColors').value(false);
        sandbox.stub(Base.cursor, 'CR');
        sandbox.stub(Base.window, 'width').value(-3);

        var expectedTotal = 1;
        var expectedOptions = {};
        runner = createMockRunner('test end', 'test end');
        runner.total = expectedTotal;
        var stdout = runReporter({}, runner, expectedOptions);

        expect(stdout, 'to equal', []);
      });
    });
    describe('if line has changed', function() {
      it('should write expected progress of open and close options', function() {
        sandbox.stub(Base, 'useColors').value(false);
        sandbox.stub(Base.cursor, 'CR');
        sandbox.stub(Base.window, 'width').value(5);

        var expectedTotal = 12;
        var expectedOpen = 'OpEn';
        var expectedClose = 'cLoSe';
        var expectedIncomplete = 'iNcOmPlEtE';
        var expectedOptions = {
          open: expectedOpen,
          complete: 'cOmPlEtE',
          incomplete: expectedIncomplete,
          close: expectedClose
        };
        var options = {
          reporterOptions: expectedOptions
        };
        runner = createMockRunner('test end', 'test end');
        runner.total = expectedTotal;
        var stdout = runReporter({}, runner, options);

        var expectedArray = [
          '\u001b[J',
          '  ' + expectedOpen,
          '',
          expectedIncomplete,
          expectedClose
        ];
        expect(Base.cursor.CR, 'was called');
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
      runReporter(reporterStub, runner, {});

      expect(reporterStub.epilogue, 'was called');
      expect(Base.cursor.show, 'was called');
    });
  });
});
