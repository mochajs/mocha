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
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
    useColors = Base.useColors;
    windowWidth = Base.window.width;
    Base.useColors = false;
    Base.window.width = 0;
  });

  afterEach(function() {
    Base.useColors = useColors;
    Base.window.width = windowWidth;
    process.stdout.write = stdoutWrite;
  });

  describe('on start', function() {
    it('should return a new line', function() {
      runner = createMockRunner('start', 'start');
      Dot.call({epilogue: function() {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = ['\n'];
      expect(stdout, 'to equal', expectedArray);
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
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function() {
      it('should return a coma', function() {
        runner = createMockRunner('pending', 'pending');
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [Base.symbols.comma];
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
        it('should return a new line and then a dot', function() {
          runner = createMockRunner('pass', 'pass', null, null, test);
          Dot.call({epilogue: function() {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = ['\n  ', Base.symbols.dot];
          expect(stdout, 'to equal', expectedArray);
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
          expect(stdout, 'to equal', expectedArray);
        });
      });
      describe('if test speed is slow', function() {
        it('should return a dot', function() {
          test.duration = 2;
          runner = createMockRunner('pass', 'pass', null, null, test);
          Dot.call({epilogue: function() {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = [Base.symbols.dot];
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
      it('should return a new line and then an exclamation mark', function() {
        runner = createMockRunner('fail', 'fail', null, null, test);
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = ['\n  ', Base.symbols.bang];
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function() {
      it('should return an exclamation mark', function() {
        runner = createMockRunner('fail', 'fail', null, null, test);
        Dot.call({epilogue: function() {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [Base.symbols.bang];
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
      Dot.call({epilogue: epilogue}, runner);
      process.stdout.write = stdoutWrite;
      expect(epilogueCalled, 'to be', true);
    });
  });
});
