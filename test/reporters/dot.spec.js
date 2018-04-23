'use strict';

var reporters = require('../../').reporters;
var Dot = reporters.Dot;
var Base = reporters.Base;

var createMockRunner = require('./helpers.js').createMockRunner;

describe('Dot reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;
  var windowWidth;

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    windowWidth = Base.window.width;
    Base.useColors = false;
    Base.window.width = 0;
  });

  afterEach(function() {
    Base.useColors = useColors;
    Base.window.width = windowWidth;
  });

  describe('on start', function() {
    it('should return a new line', function() {
      runner = createMockRunner('start', 'start');
      Dot.call({epilogue: function() {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = ['\n'];
      expect(stdout).to.eql(expectedArray);
    });
  });
  describe('on pending', function() {
    describe('if window width is greater than 1', function() {
      beforeEach(function() {
        Base.window.width = 2;
      });
      it('should return a new line and then a coma', function() {
        runner = createMockRunner('pending', 'pending');
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = ['\n  ', Base.symbols.comma];
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function() {
      it('should return a coma', function() {
        runner = createMockRunner('pending', 'pending');
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [Base.symbols.comma];
        expect(stdout).to.eql(expectedArray);
      });
    });
  });
  describe('on pass', function() {
    var test = {
      duration: 1,
      slow: function() {
        return 2;
      }
    };
    describe('if window width is greater than 1', function() {
      beforeEach(function() {
        Base.window.width = 2;
      });
      describe('if test speed is fast', function() {
        it('should return a new line and then a dot', function() {
          runner = createMockRunner('pass', 'pass', null, null, test);
          Dot.call({epilogue: function() {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = ['\n  ', Base.symbols.dot];
          expect(stdout).to.eql(expectedArray);
        });
      });
    });
    describe('if window width is equal to or less than 1', function() {
      describe('if test speed is fast', function() {
        it('should return a dot', function() {
          runner = createMockRunner('pass', 'pass', null, null, test);
          Dot.call({epilogue: function() {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = [Base.symbols.dot];
          expect(stdout).to.eql(expectedArray);
        });
      });
      describe('if test speed is slow', function() {
        it('should return a dot', function() {
          test.duration = 2;
          runner = createMockRunner('pass', 'pass', null, null, test);
          Dot.call({epilogue: function() {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = [Base.symbols.dot];
          expect(stdout).to.eql(expectedArray);
        });
      });
    });
  });
  describe('on fail', function() {
    var test = {
      test: {
        err: 'some error'
      }
    };
    describe('if window width is greater than 1', function() {
      beforeEach(function() {
        Base.window.width = 2;
      });
      it('should return a new line and then an exclamation mark', function() {
        runner = createMockRunner('fail', 'fail', null, null, test);
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = ['\n  ', Base.symbols.bang];
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function() {
      it('should return an exclamation mark', function() {
        runner = createMockRunner('fail', 'fail', null, null, test);
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [Base.symbols.bang];
        expect(stdout).to.eql(expectedArray);
      });
    });
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
        Dot.call({epilogue: function() {}}, runner, {
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
    it('should call the epilogue', function() {
      runner = createMockRunner('end', 'end');
      var epilogueCalled = false;
      var epilogue = function() {
        epilogueCalled = true;
      };
      Dot.call({epilogue: epilogue}, runner);
      process.stdout.write = stdoutWrite;
      expect(epilogueCalled).to.be(true);
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
        Dot.call({epilogue: function() {}}, runner, {
          reporterOptions: {showErrorsImmediately: true}
        });
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          [
            '  ' + functionCount + ') ' + expectedTestTitle + ':',
            '   ' + error.stack.replace(/^/gm, '  '),
            '',
            ''
          ].join('\n'),
          '\n'
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
  });
});
