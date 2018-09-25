'use strict';

var reporters = require('../../').reporters;
var Dot = reporters.Dot;
var Base = reporters.Base;

var createMockRunner = require('./helpers.js').createMockRunner;

describe('Dot reporter', function() {
  var stdout;
  var runner;
  var useColors;
  var windowWidth;
  var color;
  var showOutput = false;

  /**
   * Run reporter using stream reassignment to capture output.
   *
   * @param {Object} stubSelf - Reporter-like stub instance
   * @param {Runner} runner - Mock instance
   * @param {boolean} [tee=false] - If `true`, echo captured output to screen
   */
  function runReporter(stubSelf, runner, tee) {
    // Reassign stream in order to make a copy of all reporter output
    var stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      if (tee) {
        stdoutWrite.call(process.stdout, string, enc, callback);
      }
    };

    // Invoke reporter
    Dot.call(stubSelf, runner);

    // Revert stream reassignment here so reporter output
    // can't be corrupted if any test assertions throw
    process.stdout.write = stdoutWrite;
  }

  beforeEach(function() {
    stdout = [];
    useColors = Base.useColors;
    windowWidth = Base.window.width;
    color = Base.color;
    Base.useColors = false;
    Base.window.width = 0;
    Base.color = function(type, str) {
      return type.replace(/ /g, '-') + '_' + str;
    };
  });

  afterEach(function() {
    Base.useColors = useColors;
    Base.window.width = windowWidth;
    Base.color = color;
    runner = undefined;
  });

  describe('on start', function() {
    it('should write a newline', function() {
      runner = createMockRunner('start', 'start');
      runReporter({epilogue: function() {}}, runner, showOutput);
      var expectedArray = ['\n'];
      expect(stdout, 'to equal', expectedArray);
    });
  });
  describe('on pending', function() {
    describe('if window width is greater than 1', function() {
      beforeEach(function() {
        Base.window.width = 2;
      });
      it('should write a newline followed by a comma', function() {
        runner = createMockRunner('pending', 'pending');
        runReporter({epilogue: function() {}}, runner, showOutput);
        var expectedArray = ['\n  ', 'pending_' + Base.symbols.comma];
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function() {
      it('should write a comma', function() {
        runner = createMockRunner('pending', 'pending');
        runReporter({epilogue: function() {}}, runner, showOutput);
        var expectedArray = ['pending_' + Base.symbols.comma];
        expect(stdout, 'to equal', expectedArray);
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
        it('should write a newline followed by a dot', function() {
          runner = createMockRunner('pass', 'pass', null, null, test);
          runReporter({epilogue: function() {}}, runner, showOutput);
          expect(test.speed, 'to equal', 'fast');
          var expectedArray = ['\n  ', 'fast_' + Base.symbols.dot];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });
    describe('if window width is equal to or less than 1', function() {
      describe('if test speed is fast', function() {
        it('should write a grey dot', function() {
          runner = createMockRunner('pass', 'pass', null, null, test);
          runReporter({epilogue: function() {}}, runner, showOutput);
          expect(test.speed, 'to equal', 'fast');
          var expectedArray = ['fast_' + Base.symbols.dot];
          expect(stdout, 'to equal', expectedArray);
        });
      });
      describe('if test speed is medium', function() {
        it('should write a yellow dot', function() {
          test.duration = 2;
          runner = createMockRunner('pass', 'pass', null, null, test);
          runReporter({epilogue: function() {}}, runner, showOutput);
          expect(test.speed, 'to equal', 'medium');
          var expectedArray = ['medium_' + Base.symbols.dot];
          expect(stdout, 'to equal', expectedArray);
        });
      });
      describe('if test speed is slow', function() {
        it('should write a bright yellow dot', function() {
          test.duration = 3;
          runner = createMockRunner('pass', 'pass', null, null, test);
          runReporter({epilogue: function() {}}, runner, showOutput);
          expect(test.speed, 'to equal', 'slow');
          var expectedArray = ['bright-yellow_' + Base.symbols.dot];
          expect(stdout, 'to equal', expectedArray);
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
      it('should write a newline followed by an exclamation mark', function() {
        runner = createMockRunner('fail', 'fail', null, null, test);
        runReporter({epilogue: function() {}}, runner, showOutput);
        var expectedArray = ['\n  ', 'fail_' + Base.symbols.bang];
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function() {
      it('should write an exclamation mark', function() {
        runner = createMockRunner('fail', 'fail', null, null, test);
        runReporter({epilogue: function() {}}, runner, showOutput);
        var expectedArray = ['fail_' + Base.symbols.bang];
        expect(stdout, 'to equal', expectedArray);
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
      runReporter({epilogue: epilogue}, runner, showOutput);
      expect(epilogueCalled, 'to be', true);
    });
  });
});
