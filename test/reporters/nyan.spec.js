'use strict';

var reporters = require('../../').reporters;
var NyanCat = reporters.Nyan;
var Base = reporters.Base;

describe('Nyan reporter', function () {
  describe('events', function () {
    var runner;
    var stdout;
    var stdoutWrite;

    beforeEach(function () {
      stdout = [];
      runner = {};
      stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
    });

    describe('on start', function () {
      it('should call draw', function () {
        var calledDraw = false;
        runner.on = function (event, callback) {
          if (event === 'start') {
            callback();
          }
        };
        NyanCat.call({
          draw: function () {
            calledDraw = true;
          },
          generateColors: function () {}
        }, runner);
        process.stdout.write = stdoutWrite;

        expect(calledDraw).to.be(true);
      });
    });
    describe('on pending', function () {
      it('should call draw', function () {
        var calledDraw = false;
        runner.on = function (event, callback) {
          if (event === 'pending') {
            callback();
          }
        };
        NyanCat.call({
          draw: function () {
            calledDraw = true;
          },
          generateColors: function () {}
        }, runner);
        process.stdout.write = stdoutWrite;

        expect(calledDraw).to.be(true);
      });
    });
    describe('on pass', function () {
      it('should call draw', function () {
        var calledDraw = false;
        runner.on = function (event, callback) {
          if (event === 'pass') {
            var test = {
              duration: '',
              slow: function () {}
            };
            callback(test);
          }
        };
        NyanCat.call({
          draw: function () {
            calledDraw = true;
          },
          generateColors: function () {}
        }, runner);
        process.stdout.write = stdoutWrite;

        expect(calledDraw).to.be(true);
      });
    });
    describe('on fail', function () {
      it('should call draw', function () {
        var calledDraw = false;
        runner.on = function (event, callback) {
          if (event === 'fail') {
            var test = {
              err: ''
            };
            callback(test);
          }
        };
        NyanCat.call({
          draw: function () {
            calledDraw = true;
          },
          generateColors: function () {}
        }, runner);
        process.stdout.write = stdoutWrite;

        expect(calledDraw).to.be(true);
      });
    });
    describe('on end', function () {
      it('should call epilogue', function () {
        var calledEpilogue = false;
        runner.on = function (event, callback) {
          if (event === 'end') {
            callback();
          }
        };
        NyanCat.call({
          draw: function () {},
          generateColors: function () {},
          epilogue: function () {
            calledEpilogue = true;
          }
        }, runner);
        process.stdout.write = stdoutWrite;

        expect(calledEpilogue).to.be(true);
      });
      it('should write numberOfLines amount of new lines', function () {
        var expectedNumberOfLines = 4;
        runner.on = function (event, callback) {
          if (event === 'end') {
            callback();
          }
        };
        NyanCat.call({
          draw: function () {},
          generateColors: function () {},
          epilogue: function () {}
        }, runner);

        var arrayOfNewlines = stdout.filter(function (value) { return value === '\n'; });
        process.stdout.write = stdoutWrite;

        expect(arrayOfNewlines).to.have.length(expectedNumberOfLines);
      });
      it('should call Base show', function () {
        var showCalled = false;
        var cachedShow = Base.cursor.show;
        Base.cursor.show = function () {
          showCalled = true;
        };
        runner.on = function (event, callback) {
          if (event === 'end') {
            callback();
          }
        };
        NyanCat.call({
          draw: function () {},
          generateColors: function () {},
          epilogue: function () {}
        }, runner);

        process.stdout.write = stdoutWrite;
        expect(showCalled).to.be(true);
        Base.cursor.show = cachedShow;
      });
    });
  });

  describe('draw', function () {
    var stdout;
    var stdoutWrite;

    beforeEach(function () {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
    });

    describe('if tick is false', function () {
      it('should draw face with expected spaces, _ and ^', function () {
        var nyanCat = new NyanCat({on: function () {}});
        nyanCat.stats = { passes: 2, pending: 1, failures: 0 };

        nyanCat.draw.call({
          tick: false,
          appendRainbow: function () {},
          rainbowify: function () {},
          drawScoreboard: function () {},
          drawRainbow: function () {},
          drawNyanCat: NyanCat.prototype.drawNyanCat,
          scoreboardWidth: 0,
          trajectories: [[]],
          face: function () {},
          cursorUp: function () {}
        });

        process.stdout.write = stdoutWrite;
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
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if tick is true', function () {
      it('should draw face with expected spaces, _ and ~', function () {
        var nyanCat = new NyanCat({on: function () {}});
        nyanCat.stats = { passes: 2, pending: 1, failures: 0 };

        nyanCat.draw.call({
          tick: true,
          appendRainbow: function () {},
          rainbowify: function () {},
          drawScoreboard: function () {},
          drawRainbow: function () {},
          drawNyanCat: NyanCat.prototype.drawNyanCat,
          scoreboardWidth: 0,
          trajectories: [[]],
          face: function () {},
          cursorUp: function () {}
        });

        process.stdout.write = stdoutWrite;
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
        expect(stdout).to.eql(expectedArray);
      });
    });
  });

  describe('cursorDown', function () {
    var stdout;
    var stdoutWrite;

    beforeEach(function () {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
    });

    it('should write cursor down interaction with expected number', function () {
      var nyanCat = new NyanCat({on: function () {}});
      var expectedNumber = 25;

      nyanCat.cursorDown(expectedNumber);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\u001b[' + expectedNumber + 'B'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });

  describe('cursorUp', function () {
    var stdout;
    var stdoutWrite;

    beforeEach(function () {
      stdout = [];
      stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
    });

    it('should write cursor up interaction with expected number', function () {
      var nyanCat = new NyanCat({on: function () {}});
      var expectedNumber = 25;

      nyanCat.cursorUp(expectedNumber);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\u001b[' + expectedNumber + 'A'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });

  describe('rainbowify', function () {
    describe('useColors is false', function () {
      var useColors;

      beforeEach(function () {
        useColors = Base.useColors;
        Base.useColors = false;
      });

      afterEach(function () {
        Base.useColors = useColors;
      });

      it('should return argument string', function () {
        var nyanCat = new NyanCat({on: function () {}});
        var expectedString = 'hello';
        var outputString = nyanCat.rainbowify(expectedString);

        expect(outputString).to.equal(expectedString);
      });
    });
    describe('useColors is true', function () {
      var useColors;

      beforeEach(function () {
        useColors = Base.useColors;
        Base.useColors = true;
      });

      afterEach(function () {
        Base.useColors = useColors;
      });
      it('should return rainbowified string from the given string and predefined codes', function () {
        var startCode = '\u001b[38;5;';
        var endCode = '\u001b[0m';
        var nyanCat = new NyanCat({on: function () {}});
        var expectedString = 'hello';
        var colorCode = 'somecode';
        var expectedRainbowifyString = startCode + colorCode + 'm' + expectedString + endCode;
        var outputString = nyanCat.rainbowify.call(
          {
            rainbowColors: [colorCode],
            colorIndex: 0
          },
          expectedString);

        expect(outputString).to.equal(expectedRainbowifyString);
      });
    });
  });

  describe('appendRainbow', function () {
    describe('if tick is true', function () {
      it('should set an _ segment', function () {
        var nyanCat = new NyanCat({on: function () {}});
        var expectedSegment;
        var inputArray = [];
        var trajectories = [inputArray, inputArray, inputArray, inputArray];
        nyanCat.appendRainbow.call({
          tick: true,
          rainbowify: function (segment) {
            expectedSegment = segment;
          },
          numberOfLines: 4,
          trajectoryWidthMax: 0,
          trajectories: trajectories
        });

        expect(expectedSegment).to.equal('_');
      });
      it('should shift each trajectory item, if its length is greater of equal to its max width', function () {
        var nyanCat = new NyanCat({on: function () {}});

        var rainbowifyResult = 'rainbowify';
        var inputArray = ['itemToShify'];
        var trajectories = [inputArray, inputArray, inputArray, inputArray];
        var expectedArray = [rainbowifyResult];
        var expectedTrajectories = [expectedArray, expectedArray, expectedArray, expectedArray];
        nyanCat.appendRainbow.call({
          tick: true,
          rainbowify: function () { return rainbowifyResult; },
          numberOfLines: 4,
          trajectoryWidthMax: 0,
          trajectories: trajectories
        });

        expect(trajectories).to.eql(expectedTrajectories);
      });
    });
    describe('if tick is false', function () {
      it('should set an - segment', function () {
        var nyanCat = new NyanCat({on: function () {}});
        var expectedSegment;
        var inputArray = [];
        var trajectories = [inputArray, inputArray, inputArray, inputArray];
        nyanCat.appendRainbow.call({
          tick: false,
          rainbowify: function (segment) {
            expectedSegment = segment;
          },
          numberOfLines: 4,
          trajectoryWidthMax: 5,
          trajectories: trajectories
        });

        expect(expectedSegment).to.eql('-');
      });
    });
  });

  describe('drawScoreboard', function () {
    it('should write scoreboard with color set with each stat', function () {
      var cachedColor = Base.color;
      Base.color = function (type, n) {
        return type + n;
      };
      var stdout = [];
      var stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };

      var passes = 2;
      var pending = 1;
      var failures = 1;
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.drawScoreboard.call({
        cursorUp: function () {},
        stats: { passes: passes, pending: pending, failures: failures },
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
      expect(stdout).to.eql(expectedArray);
      process.stdout.write = stdoutWrite;
      Base.color = cachedColor;
    });
    it('should call cursorUp with given numberOfLines', function () {
      var stdout = [];
      var stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
      var expectedCursorArgument = null;
      var expectedNumberOfLines = 1000;

      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.drawScoreboard.call({
        cursorUp: function (lines) {
          expectedCursorArgument = lines;
        },
        stats: { passes: 0, pending: 0, failures: 0 },
        numberOfLines: expectedNumberOfLines
      });

      expect(expectedCursorArgument).to.equal(expectedNumberOfLines);
      process.stdout.write = stdoutWrite;
    });
  });

  describe('drawRainbow', function () {
    it('should write width, contents and newline for each trajectory', function () {
      var stdout = [];
      var stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
      var expectedWidth = 444;

      var expectedContents = 'input';
      var inputArray = [expectedContents];
      var trajectories = [inputArray];
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.drawRainbow.call({
        cursorUp: function () {},
        trajectories: trajectories,
        scoreboardWidth: expectedWidth,
        numberOfLines: 1
      });

      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\u001b[' + expectedWidth + 'C',
        expectedContents,
        '\n'
      ];
      expect(stdout).to.eql(expectedArray);
    });

    it('should call cursorUp with given numberOfLines', function () {
      var stdout = [];
      var stdoutWrite = process.stdout.write;
      process.stdout.write = function (string) {
        stdout.push(string);
      };
      var expectedCursorArgument = null;
      var expectedNumberOfLines = 1000;

      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.drawRainbow.call({
        cursorUp: function (lines) {
          expectedCursorArgument = lines;
        },
        trajectories: [['input']],
        scoreboardWidth: 1,
        numberOfLines: expectedNumberOfLines
      });

      expect(expectedCursorArgument).to.equal(expectedNumberOfLines);
      process.stdout.write = stdoutWrite;
    });
  });
  describe('face', function () {
    it('expected face:(x .x) when "failures" at least one', function () {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 2, pending: 1, failures: 1 };
      expect(nyanCat.face()).to.equal('( x .x)');
    });

    it('expected face:(x .x) when "pending" at least one and no failing', function () {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 2, pending: 1, failures: 0 };
      expect(nyanCat.face()).to.equal('( o .o)');
    });

    it('expected face:(^ .^) when "passing" only', function () {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 1, pending: 0, failures: 0 };
      expect(nyanCat.face()).to.equal('( ^ .^)');
    });

    it('expected face:(- .-) when otherwise', function (done) {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 0, pending: 0, failures: 0 };
      expect(nyanCat.face()).to.equal('( - .-)');
      done();
    });
  });
});
