'use strict';

var reporters = require('../../').reporters;
var Dot = reporters.Dot;
var Base = reporters.Base;

describe('Dot reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;
  var windowWidth;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    windowWidth = Base.window.width;
    Base.useColors = false;
    Base.window.width = 0;
  });

  afterEach(function () {
    Base.useColors = useColors;
    Base.window.width = windowWidth;
  });

  describe('on start', function () {
    it('should return a new line', function () {
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      Dot.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\n'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });
  describe('on pending', function () {
    describe('if window width is greater than 1', function () {
      beforeEach(function () {
        Base.window.width = 2;
      });
      it('should return a new line and then a coma', function () {
        runner.on = function (event, callback) {
          if (event === 'pending') {
            callback();
          }
        };
        Dot.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '\n  ',
          Base.symbols.comma
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function () {
      it('should return a coma', function () {
        runner.on = function (event, callback) {
          if (event === 'pending') {
            callback();
          }
        };
        Dot.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          Base.symbols.comma
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
  });
  describe('on pass', function () {
    describe('if window width is greater than 1', function () {
      beforeEach(function () {
        Base.window.width = 2;
      });
      describe('if test speed is fast', function () {
        it('should return a new line and then a dot', function () {
          var test = {
            duration: 1,
            slow: function () { return 2; }
          };
          runner.on = function (event, callback) {
            if (event === 'pass') {
              callback(test);
            }
          };
          Dot.call({epilogue: function () {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = [
            '\n  ',
            Base.symbols.dot
          ];
          expect(stdout).to.eql(expectedArray);
        });
      });
    });
    describe('if window width is equal to or less than 1', function () {
      describe('if test speed is fast', function () {
        it('should return a dot', function () {
          var test = {
            duration: 1,
            slow: function () { return 2; }
          };
          runner.on = function (event, callback) {
            if (event === 'pass') {
              callback(test);
            }
          };
          Dot.call({epilogue: function () {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = [
            Base.symbols.dot
          ];
          expect(stdout).to.eql(expectedArray);
        });
      });
      describe('if test speed is slow', function () {
        it('should return a dot', function () {
          var test = {
            duration: 2,
            slow: function () { return 1; }
          };
          runner.on = function (event, callback) {
            if (event === 'pass') {
              callback(test);
            }
          };
          Dot.call({epilogue: function () {}}, runner);
          process.stdout.write = stdoutWrite;
          var expectedArray = [
            Base.symbols.dot
          ];
          expect(stdout).to.eql(expectedArray);
        });
      });
    });
  });
  describe('on fail', function () {
    describe('if window width is greater than 1', function () {
      beforeEach(function () {
        Base.window.width = 2;
      });
      it('should return a new line and then an exclamation mark', function () {
        var test = {
          test: {
            err: 'some error'
          }
        };
        runner.on = function (event, callback) {
          if (event === 'fail') {
            callback(test);
          }
        };
        Dot.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '\n  ',
          Base.symbols.bang
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if window width is equal to or less than 1', function () {
      it('should return an exclamation mark', function () {
        var test = {
          test: {
            err: 'some error'
          }
        };
        runner.on = function (event, callback) {
          if (event === 'fail') {
            callback(test);
          }
        };
        Dot.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          Base.symbols.bang
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
  });
  describe('on end', function () {
    it('should call the epilogue', function () {
      runner.on = function (event, callback) {
        if (event === 'end') {
          callback();
        }
      };
      var epilogueCalled = false;
      var epilogue = function () {
        epilogueCalled = true;
      };
      Dot.call({epilogue: epilogue}, runner);
      process.stdout.write = stdoutWrite;
      expect(epilogueCalled).to.be(true);
    });
  });
});
