'use strict';

var reporters = require('../../').reporters;
var NyanCat = reporters.Nyan;
var Base = reporters.Base;

describe('Nyon reporter', function () {
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

        calledDraw.should.be.true();
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

        calledDraw.should.be.true();
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

        calledDraw.should.be.true();
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

        calledDraw.should.be.true();
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

        calledEpilogue.should.be.true();
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

        stdout.shift();
        var arrayWithoutShow = stdout;
        process.stdout.write = stdoutWrite;
        arrayWithoutShow.should.have.length(expectedNumberOfLines);
      });
      it('should write cursor interaction for show', function () {
        var expectedShowInteraction = '\u001b[?25h';
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
        stdout[0].should.equal(expectedShowInteraction);
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
      it('should draw scoreboard, rainbox and face', function () {
        var nyanCat = new NyanCat({on: function () {}});
        nyanCat.stats = { passes: 2, pending: 1, failures: 0 };

        nyanCat.draw();
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          ' ',
          '\u001b[32m2\u001b[0m',
          '\n',
          ' ',
          '\u001b[31m0\u001b[0m',
          '\n',
          ' ',
          '\u001b[36m1\u001b[0m',
          '\n',
          '\n',
          '\u001b[4A',
          '\u001b[5C',
          '\u001b[38;5;154m-\u001b[0m',
          '\n',
          '\u001b[5C',
          '\u001b[38;5;154m-\u001b[0m',
          '\n',
          '\u001b[5C',
          '\u001b[38;5;154m-\u001b[0m',
          '\n',
          '\u001b[5C',
          '\u001b[38;5;154m-\u001b[0m',
          '\n',
          '\u001b[4A',
          '\u001b[6C',
          '_,------,',
          '\n',
          '\u001b[6C',
          '_|   /\\_/\\ ',
          '\n',
          '\u001b[6C',
          '^|__( o .o) ',
          '\n',
          '\u001b[6C',
          '  ""  "" ',
          '\n',
          '\u001b[4A'
        ];
        stdout.should.deepEqual(expectedArray);
      });
    });
    describe('if tick is true', function () {
      it('should draw scoreboard, rainbox and face', function () {
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
        stdout.should.deepEqual(expectedArray);
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

    it('should write cursor down interaction with expected number ', function () {
      var nyanCat = new NyanCat({on: function () {}});
      var expectedNumber = 25;

      nyanCat.cursorDown(expectedNumber);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\u001b[' + expectedNumber + 'B'
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });

  describe('rainbowify', function () {
    var useColors;

    beforeEach(function () {
      Base.useColors = false;
    });

    afterEach(function () {
      Base.useColors = useColors;
    });

    it('should return argument string if useColors is false', function () {
      var nyanCat = new NyanCat({on: function () {}});
      var expectedString = 'hello';
      var outputString = nyanCat.rainbowify(expectedString);

      outputString.should.equal(expectedString);
    });
  });

  describe('appendRainbow', function () {
    describe('if tick is true', function () {
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

        trajectories.should.deepEqual(expectedTrajectories);
      });
    });
  });

  describe('face', function () {
    it('expected face:(x .x) when "failures" at least one', function () {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 2, pending: 1, failures: 1 };
      nyanCat.face().should.equal('( x .x)');
    });

    it('expected face:(x .x) when "pending" at least one and no failing', function () {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 2, pending: 1, failures: 0 };
      nyanCat.face().should.equal('( o .o)');
    });

    it('expected face:(^ .^) when "passing" only', function () {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 1, pending: 0, failures: 0 };
      nyanCat.face().should.equal('( ^ .^)');
    });

    it('expected face:(- .-) when otherwise', function (done) {
      var nyanCat = new NyanCat({on: function () {}});
      nyanCat.stats = { passes: 0, pending: 0, failures: 0 };
      nyanCat.face().should.equal('( - .-)');
      done();
    });
  });
});
