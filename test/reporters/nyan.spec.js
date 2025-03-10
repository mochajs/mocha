'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var Base = reporters.Base;
var NyanCat = reporters.Nyan;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;
var EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('Nyan reporter', function () {
  var noop = function () {};

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    var runReporter = makeRunReporter(NyanCat);

    describe("on 'start' event", function () {
      it('should call draw', function () {
        var fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };

        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'pending' event", function () {
      it('should call draw', function () {
        var fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        var runner = createMockRunner('pending', EVENT_TEST_PENDING);
        var options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'pass' event", function () {
      it('should call draw', function () {
        var test = {
          duration: '',
          slow: noop
        };
        var fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        var runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          test
        );
        var options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'fail' event", function () {
      it('should call draw', function () {
        var test = {
          err: ''
        };
        var fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        var runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        var options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'end' event", function () {
      it('should call epilogue', function () {
        var fakeThis = {
          draw: noop,
          epilogue: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.epilogue.called, 'to be true');
      });

      it('should write numberOfLines amount of newlines', function () {
        var expectedNumberOfLines = 4;
        var fakeThis = {
          draw: noop,
          epilogue: noop,
          generateColors: noop
        };
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        var stdout = runReporter(fakeThis, runner, options);

        var isBlankLine = function (value) {
          return value === '\n';
        };

        expect(
          stdout.filter(isBlankLine),
          'to have length',
          expectedNumberOfLines
        );
      });

      it('should call Base show', function () {
        var showCursorStub = sinon.stub(Base.cursor, 'show');
        var fakeThis = {
          draw: noop,
          epilogue: noop,
          generateColors: noop
        };
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(showCursorStub.called, 'to be true');
      });
    });
  });

  describe('#draw', function () {
    var stdoutWriteStub;
    var stdout;

    beforeEach(function () {
      stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    describe("when 'tick' is false", function () {
      it('should draw face with expected spaces, _ and ^', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);
        nyanCat.stats = {passes: 2, pending: 1, failures: 0};
        var fakeThis = {
          tick: false,
          appendRainbow: noop,
          rainbowify: noop,
          drawScoreboard: noop,
          drawRainbow: noop,
          drawNyanCat: NyanCat.prototype.drawNyanCat,
          scoreboardWidth: 0,
          trajectories: [[]],
          face: noop,
          cursorUp: noop
        };

        try {
          nyanCat.draw.call(fakeThis);
        } finally {
          sinon.restore();
        }

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

    describe("when 'tick' is true", function () {
      it('should draw face with expected spaces, _ and ~', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);
        nyanCat.stats = {passes: 2, pending: 1, failures: 0};
        var fakeThis = {
          tick: true,
          appendRainbow: noop,
          rainbowify: noop,
          drawScoreboard: noop,
          drawRainbow: noop,
          drawNyanCat: NyanCat.prototype.drawNyanCat,
          scoreboardWidth: 0,
          trajectories: [[]],
          face: noop,
          cursorUp: noop
        };

        try {
          nyanCat.draw.call(fakeThis);
        } finally {
          sinon.restore();
        }

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

  describe('#cursorDown', function () {
    var stdoutWriteStub;
    var stdout;

    beforeEach(function () {
      stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write cursor down interaction with expected number', function () {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      var expectedNumber = 25;

      try {
        nyanCat.cursorDown(expectedNumber);
      } finally {
        sinon.restore();
      }

      var expectedArray = ['\u001b[' + expectedNumber + 'B'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('#cursorUp', function () {
    var stdoutWriteStub;
    var stdout;

    beforeEach(function () {
      stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write cursor up interaction with expected number', function () {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      var expectedNumber = 25;

      try {
        nyanCat.cursorUp(expectedNumber);
      } finally {
        sinon.restore();
      }

      var expectedArray = ['\u001b[' + expectedNumber + 'A'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('#rainbowify', function () {
    var useColorsStub;

    beforeEach(function () {
      useColorsStub = sinon.stub(Base, 'useColors');
    });

    afterEach(function () {
      sinon.restore();
    });

    describe("when 'useColors' is false", function () {
      beforeEach(function () {
        useColorsStub.value(false);
      });

      it('should return argument string', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);

        var inputString = 'hello';
        var outputString = nyanCat.rainbowify(inputString);
        sinon.restore();

        var expectedString = inputString;
        expect(outputString, 'to be', expectedString);
      });
    });

    describe("when 'useColors' is true", function () {
      beforeEach(function () {
        useColorsStub.value(true);
      });

      it('should return rainbowified string from the given string and predefined codes', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);

        var inputString = 'hello';
        var colorCode = 'somecode';
        var fakeThis = {
          rainbowColors: [colorCode],
          colorIndex: 0
        };
        var outputString = nyanCat.rainbowify.call(fakeThis, inputString);
        sinon.restore();

        var startCode = '\u001b[38;5;';
        var endCode = '\u001b[0m';
        var expectedString =
          startCode + colorCode + 'm' + inputString + endCode;
        expect(outputString, 'to be', expectedString);
      });
    });
  });

  describe('#appendRainbow', function () {
    describe("when 'tick' is true", function () {
      it('should set an underscore segment', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);
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
          trajectories
        });

        expect(expectedSegment, 'to be', '_');
      });

      it('should shift each trajectory item if its length is greater than or equal to its max width', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);

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
          rainbowify: function () {
            return rainbowifyResult;
          },
          numberOfLines: 4,
          trajectoryWidthMax: 0,
          trajectories
        });

        expect(trajectories, 'to equal', expectedTrajectories);
      });
    });

    describe("when 'tick' is false", function () {
      it('should set a dash segment', function () {
        var runner = {on: noop, once: noop};
        var options = {};
        var nyanCat = new NyanCat(runner, options);
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
          trajectories
        });

        expect(expectedSegment, 'to equal', '-');
      });
    });
  });

  describe('#drawScoreboard', function () {
    var stdout;

    beforeEach(function () {
      sinon.stub(Base, 'color').callsFake(function (type, n) {
        return type + n;
      });
      var stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write scoreboard with color set with each stat', function () {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);

      var passes = 2;
      var pending = 1;
      var failures = 1;

      var fakeThis = {
        cursorUp: noop,
        stats: {passes, pending, failures},
        numberOfLines: 4
      };

      try {
        nyanCat.drawScoreboard.call(fakeThis);
      } finally {
        sinon.restore();
      }

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

    it('should call cursorUp with given numberOfLines', function () {
      var expectedNumberOfLines = 1000;

      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      var fakeThis = {
        cursorUp: sinon.spy(),
        stats: {passes: 0, pending: 0, failures: 0},
        numberOfLines: expectedNumberOfLines
      };

      try {
        nyanCat.drawScoreboard.call(fakeThis);
      } finally {
        sinon.restore();
      }

      expect(fakeThis.cursorUp.calledWith(expectedNumberOfLines), 'to be true');
    });
  });

  describe('#drawRainbow', function () {
    var stdout;

    beforeEach(function () {
      var stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write width, contents and newline for each trajectory', function () {
      var expectedWidth = 444;

      var expectedContents = 'input';
      var inputArray = [expectedContents];
      var trajectories = [inputArray];
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      var fakeThis = {
        cursorUp: noop,
        trajectories,
        scoreboardWidth: expectedWidth,
        numberOfLines: 1
      };

      try {
        nyanCat.drawRainbow.call(fakeThis);
      } finally {
        sinon.restore();
      }

      var expectedArray = [
        '\u001b[' + expectedWidth + 'C',
        expectedContents,
        '\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });

    it('should call cursorUp with given numberOfLines', function () {
      var expectedCursorArgument = null;
      var expectedNumberOfLines = 1000;

      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      var fakeThis = {
        cursorUp: function (lines) {
          expectedCursorArgument = lines;
        },
        trajectories: [['input']],
        scoreboardWidth: 1,
        numberOfLines: expectedNumberOfLines
      };

      try {
        nyanCat.drawRainbow.call(fakeThis);
      } finally {
        sinon.restore();
      }

      expect(expectedCursorArgument, 'to be', expectedNumberOfLines);
    });
  });

  describe('#face', function () {
    it('should expect "( x .x)" if any failures', function () {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 2, pending: 1, failures: 1};

      expect(nyanCat.face(), 'to be', '( x .x)');
    });

    it('should expect "( o .o)" if any pending but none failing', function () {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 2, pending: 1, failures: 0};

      expect(nyanCat.face(), 'to be', '( o .o)');
    });

    it('should expect "( ^ .^)" if all passing', function () {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 1, pending: 0, failures: 0};

      expect(nyanCat.face(), 'to be', '( ^ .^)');
    });

    it('should expect "( - .-)" otherwise', function (done) {
      var runner = {on: noop, once: noop};
      var options = {};
      var nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 0, pending: 0, failures: 0};

      expect(nyanCat.face(), 'to be', '( - .-)');
      done();
    });
  });
});
