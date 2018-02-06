'use strict';

var reporters = require('../../').reporters;
var Base = reporters.Base;
var Min = reporters.Min;

var createMockRunner = require('./helpers').createMockRunner;

describe('Min reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function() {
    Base.useColors = useColors;
  });

  describe('on start', function() {
    it('should clear screen then set cursor position', function() {
      runner = createMockRunner('start', 'start');
      Min.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;
      var expectedArray = ['\u001b[2J', '\u001b[1;3H'];
      expect(stdout).to.eql(expectedArray);
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
      Min.call(
        {
          epilogue: function() {
            calledEpilogue = true;
          }
        },
        runner
      );
      process.stdout.write = stdoutWrite;

      expect(calledEpilogue).to.be(true);
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
