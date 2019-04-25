'use strict';

var sandbox = require('sinon').createSandbox();
var reporters = require('../../').reporters;
var NyanCat = reporters.Nyan;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Nyan reporter', function() {
  describe('events', function() {
    var runner;
    var options = {};
    var runReporter = makeRunReporter(NyanCat);

    afterEach(function() {
      sandbox.restore();
      runner = undefined;
    });

    describe('on start', function() {
      it('should call draw', function() {
        var reporterStub = {
          draw: function() {},
          generateColors: function() {}
        };
        sandbox.stub(reporterStub, 'draw');

        runner = createMockRunner('start', 'start');
        runReporter(reporterStub, runner, options);

        expect(reporterStub.draw, 'was called');
      });
    });
    describe('on pending', function() {
      it('should call draw', function() {
        var reporterStub = {
          draw: function() {},
          generateColors: function() {}
        };
        sandbox.stub(reporterStub, 'draw');

        runner = createMockRunner('pending', 'pending');
        runReporter(reporterStub, runner, options);

        expect(reporterStub.draw, 'was called');
      });
    });
    describe('on pass', function() {
      it('should call draw', function() {
        var reporterStub = {
          draw: function() {},
          generateColors: function() {}
        };
        sandbox.stub(reporterStub, 'draw');

        var test = {
          duration: '',
          slow: function() {}
        };
        runner = createMockRunner('pass', 'pass', null, null, test);
        runReporter(reporterStub, runner, options);

        expect(reporterStub.draw, 'was called');
      });
    });
    describe('on fail', function() {
      it('should call draw', function() {
        var reporterStub = {
          draw: function() {},
          generateColors: function() {}
        };
        sandbox.stub(reporterStub, 'draw');

        var test = {
          err: ''
        };
        runner = createMockRunner('fail', 'fail', null, null, test);
        runReporter(reporterStub, runner, options);

        expect(reporterStub.draw, 'was called');
      });
    });
    describe('on end', function() {
      it('should call epilogue', function() {
        var reporterStub = {
          draw: function() {},
          generateColors: function() {},
          epilogue: function() {}
        };
        sandbox.stub(reporterStub, 'epilogue');

        runner = createMockRunner('end', 'end');
        runReporter(reporterStub, runner, options);

        expect(reporterStub.epilogue, 'was called');
      });
      it('should write numberOfLines amount of new lines', function() {
        var expectedNumberOfLines = 4;
        runner = createMockRunner('end', 'end');
        var stdout = runReporter(
          {
            draw: function() {},
            generateColors: function() {},
            epilogue: function() {}
          },
          runner,
          options
        );

        var arrayOfNewlines = stdout.filter(function(value) {
          return value === '\n';
        });

        expect(arrayOfNewlines, 'to have length', expectedNumberOfLines);
      });
      it('should call Base show', function() {
        sandbox.stub(Base.cursor, 'show');

        runner = createMockRunner('end', 'end');
        runReporter(
          {
            draw: function() {},
            generateColors: function() {},
            epilogue: function() {}
          },
          runner,
          options
        );

        expect(Base.cursor.show, 'was called');
      });
    });
  });

  describe('draw', function() {
    var stdout;
    var stdoutWrite;

    beforeEach(function() {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function(string, enc, callback) {
        stdout.push(string);
      };
    });

    afterEach(function() {
      process.stdout.write = stdoutWrite;
    });

    describe('if tick is false', function() {
      it('should draw face with expected spaces, _ and ^', function() {
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});
        nyanCat.stats = {passes: 2, pending: 1, failures: 0};

        nyanCat.draw.call({
          tick: false,
          appendRainbow: function() {},
          rainbowify: function() {},
          drawScoreboard: function() {},
          drawRainbow: function() {},
          drawNyanCat: NyanCat.prototype.drawNyanCat,
          scoreboardWidth: 0,
          trajectories: [[]],
          face: function() {},
          cursorUp: function() {}
        });

        var expectedArray = [
          '\u001b[0C',
          '_,------,',
          '\n',
          '\u001b[0C',
          '_|   /\\_/\\ ',
          '\n',
          '\u001b[0C',
          '^|__undefined ',
          '\n',
          '\u001b[0C',
          '  ""  "" ',
          '\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if tick is true', function() {
      it('should draw face with expected spaces, _ and ~', function() {
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});
        nyanCat.stats = {passes: 2, pending: 1, failures: 0};

        nyanCat.draw.call({
          tick: true,
          appendRainbow: function() {},
          rainbowify: function() {},
          drawScoreboard: function() {},
          drawRainbow: function() {},
          drawNyanCat: NyanCat.prototype.drawNyanCat,
          scoreboardWidth: 0,
          trajectories: [[]],
          face: function() {},
          cursorUp: function() {}
        });

        var expectedArray = [
          '\u001b[0C',
          '_,------,',
          '\n',
          '\u001b[0C',
          '_|  /\\_/\\ ',
          '\n',
          '\u001b[0C',
          '~|_undefined ',
          '\n',
          '\u001b[0C',
          ' ""  "" ',
          '\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
  });

  describe('cursorDown', function() {
    var stdout;
    var stdoutWrite;

    beforeEach(function() {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function(string) {
        stdout.push(string);
      };
    });

    afterEach(function() {
      process.stdout.write = stdoutWrite;
    });

    it('should write cursor down interaction with expected number', function() {
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      var expectedNumber = 25;

      nyanCat.cursorDown(expectedNumber);
      var expectedArray = ['\u001b[' + expectedNumber + 'B'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('cursorUp', function() {
    var stdout;
    var stdoutWrite;

    beforeEach(function() {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function(string, enc, callback) {
        stdout.push(string);
      };
    });

    afterEach(function() {
      process.stdout.write = stdoutWrite;
    });

    it('should write cursor up interaction with expected number', function() {
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      var expectedNumber = 25;

      nyanCat.cursorUp(expectedNumber);
      var expectedArray = ['\u001b[' + expectedNumber + 'A'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('rainbowify', function() {
    describe('useColors is false', function() {
      beforeEach(function() {
        sandbox.stub(Base, 'useColors').value(false);
      });

      it('should return argument string', function() {
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});
        var expectedString = 'hello';
        var outputString = nyanCat.rainbowify(expectedString);

        expect(outputString, 'to be', expectedString);
      });
    });
    describe('useColors is true', function() {
      beforeEach(function() {
        sandbox.stub(Base, 'useColors').value(true);
      });

      it('should return rainbowified string from the given string and predefined codes', function() {
        var startCode = '\u001b[38;5;';
        var endCode = '\u001b[0m';
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});
        var expectedString = 'hello';
        var colorCode = 'somecode';
        var expectedRainbowifyString =
          startCode + colorCode + 'm' + expectedString + endCode;
        var outputString = nyanCat.rainbowify.call(
          {
            rainbowColors: [colorCode],
            colorIndex: 0
          },
          expectedString
        );

        expect(outputString, 'to be', expectedRainbowifyString);
      });
    });
  });

  describe('appendRainbow', function() {
    describe('if tick is true', function() {
      it('should set an _ segment', function() {
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});
        var expectedSegment;
        var inputArray = [];
        var trajectories = [inputArray, inputArray, inputArray, inputArray];
        nyanCat.appendRainbow.call({
          tick: true,
          rainbowify: function(segment) {
            expectedSegment = segment;
          },
          numberOfLines: 4,
          trajectoryWidthMax: 0,
          trajectories: trajectories
        });

        expect(expectedSegment, 'to be', '_');
      });
      it('should shift each trajectory item, if its length is greater of equal to its max width', function() {
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});

        var rainbowifyResult = 'rainbowify';
        var inputArray = ['itemToShify'];
        var trajectories = [inputArray, inputArray, inputArray, inputArray];
        var expectedArray = [rainbowifyResult];
        var expectedTrajectories = [
          expectedArray,
          expectedArray,
          expectedArray,
          expectedArray
        ];
        nyanCat.appendRainbow.call({
          tick: true,
          rainbowify: function() {
            return rainbowifyResult;
          },
          numberOfLines: 4,
          trajectoryWidthMax: 0,
          trajectories: trajectories
        });

        expect(trajectories, 'to equal', expectedTrajectories);
      });
    });
    describe('if tick is false', function() {
      it('should set an - segment', function() {
        var nyanCat = new NyanCat({on: function() {}, once: function() {}});
        var expectedSegment;
        var inputArray = [];
        var trajectories = [inputArray, inputArray, inputArray, inputArray];
        nyanCat.appendRainbow.call({
          tick: false,
          rainbowify: function(segment) {
            expectedSegment = segment;
          },
          numberOfLines: 4,
          trajectoryWidthMax: 5,
          trajectories: trajectories
        });

        expect(expectedSegment, 'to equal', '-');
      });
    });
  });

  describe('drawScoreboard', function() {
    var stdoutWrite;
    var stdout;
    var cachedColor;
    var showOutput = false;

    beforeEach(function() {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function(string, enc, callback) {
        stdout.push(string);
        if (showOutput) {
          stdoutWrite.call(process.stdout, string, enc, callback);
        }
      };
      cachedColor = Base.color;
      Base.color = function(type, n) {
        return type + n;
      };
    });

    afterEach(function() {
      process.stdout.write = stdoutWrite;
      Base.color = cachedColor;
    });

    it('should write scoreboard with color set with each stat', function() {
      var passes = 2;
      var pending = 1;
      var failures = 1;
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.drawScoreboard.call({
        cursorUp: function() {},
        stats: {passes: passes, pending: pending, failures: failures},
        numberOfLines: 4
      });
      var expectedArray = [
        ' ',
        'green' + passes,
        '\n',
        ' ',
        'fail' + failures,
        '\n',
        ' ',
        'pending' + pending,
        '\n',
        '\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });

    it('should call cursorUp with given numberOfLines', function() {
      var expectedCursorArgument = null;
      var expectedNumberOfLines = 1000;

      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.drawScoreboard.call({
        cursorUp: function(lines) {
          expectedCursorArgument = lines;
        },
        stats: {passes: 0, pending: 0, failures: 0},
        numberOfLines: expectedNumberOfLines
      });

      expect(expectedCursorArgument, 'to be', expectedNumberOfLines);
    });
  });

  describe('drawRainbow', function() {
    var stdoutWrite;
    var stdout;
    var showOutput = false;

    beforeEach(function() {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function(string, enc, callback) {
        stdout.push(string);
        if (showOutput) {
          stdoutWrite.call(process.stdout, string, enc, callback);
        }
      };
    });

    afterEach(function() {
      process.stdout.write = stdoutWrite;
    });

    it('should write width, contents and newline for each trajectory', function() {
      var expectedWidth = 444;

      var expectedContents = 'input';
      var inputArray = [expectedContents];
      var trajectories = [inputArray];
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.drawRainbow.call({
        cursorUp: function() {},
        trajectories: trajectories,
        scoreboardWidth: expectedWidth,
        numberOfLines: 1
      });

      var expectedArray = [
        '\u001b[' + expectedWidth + 'C',
        expectedContents,
        '\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });

    it('should call cursorUp with given numberOfLines', function() {
      var expectedCursorArgument = null;
      var expectedNumberOfLines = 1000;

      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.drawRainbow.call({
        cursorUp: function(lines) {
          expectedCursorArgument = lines;
        },
        trajectories: [['input']],
        scoreboardWidth: 1,
        numberOfLines: expectedNumberOfLines
      });

      expect(expectedCursorArgument, 'to be', expectedNumberOfLines);
    });
  });
  describe('face', function() {
    it('expected face:(x .x) when "failures" at least one', function() {
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.stats = {passes: 2, pending: 1, failures: 1};
      expect(nyanCat.face(), 'to be', '( x .x)');
    });

    it('expected face:(x .x) when "pending" at least one and no failing', function() {
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.stats = {passes: 2, pending: 1, failures: 0};
      expect(nyanCat.face(), 'to be', '( o .o)');
    });

    it('expected face:(^ .^) when "passing" only', function() {
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.stats = {passes: 1, pending: 0, failures: 0};
      expect(nyanCat.face(), 'to be', '( ^ .^)');
    });

    it('expected face:(- .-) when otherwise', function(done) {
      var nyanCat = new NyanCat({on: function() {}, once: function() {}});
      nyanCat.stats = {passes: 0, pending: 0, failures: 0};
      expect(nyanCat.face(), 'to be', '( - .-)');
      done();
    });
  });
});
