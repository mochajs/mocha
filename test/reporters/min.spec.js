'use strict';

var reporters = require('../../').reporters;
var Base = reporters.Base;
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

  describe('on fail', function() {
    describe('with showErrorsImmediately option', function() {
      it('should log error immediately', function() {
        var expectedTitle = 'expectedTitle';
        var functionCount = 1;
        var error = new Error('expectedMessage');
        var test = {
          title: expectedTitle,
          titlePath: function() {
            return [this.title];
          }
        };
        runner.on = function(event, callback) {
          if (event === 'fail') {
            test.err = error;
            callback(test);
          }
        };
        Min.call({epilogue: function() {}}, runner, {
          reporterOptions: {showErrorsImmediately: true}
        });
        process.stdout.write = stdoutWrite;
        expect(stdout[0]).to.eql(
          [
            '  ' + functionCount + ') ' + expectedTitle + ':',
            '   ' + error.stack.replace(/^/gm, '  '),
            '',
            ''
          ].join('\n')
        );
      });
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
    describe('with showErrorsImmediately option', function() {
      it('should not log error details again', function() {
        var expectedSuiteTitle = 'expectedSuiteTitle';
        var suite = {
          title: expectedSuiteTitle
        };
        var functionCount = 1;
        var error = new Error('expectedMessage');
        var expectedTestTitle = 'expectedTestTitle';
        var test = {
          title: expectedTestTitle,
          titlePath: function() {
            return [this.title];
          }
        };
        runner.on = function(event, callback) {
          if (event === 'suite') {
            callback(suite);
          }
          if (event === 'fail') {
            test.err = error;
            callback(test);
          }
        };
        Min.call({epilogue: function() {}}, runner, {
          reporterOptions: {showErrorsImmediately: true}
        });
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          [
            '  ' + functionCount + ') ' + expectedTestTitle + ':',
            '   ' + error.stack.replace(/^/gm, '  '),
            '',
            ''
          ].join('\n')
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
  });
});
