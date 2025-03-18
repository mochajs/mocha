'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Base = reporters.Base;
const NyanCat = reporters.Nyan;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('Nyan reporter', function () {
  const noop = function () {};

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    const runReporter = makeRunReporter(NyanCat);

    describe("on 'start' event", function () {
      it('should call draw', function () {
        const fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };

        const runner = createMockRunner('start', EVENT_RUN_BEGIN);
        const options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'pending' event", function () {
      it('should call draw', function () {
        const fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        const runner = createMockRunner('pending', EVENT_TEST_PENDING);
        const options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'pass' event", function () {
      it('should call draw', function () {
        const test = {
          duration: '',
          slow: noop
        };
        const fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        const runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          test
        );
        const options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'fail' event", function () {
      it('should call draw', function () {
        const test = {
          err: ''
        };
        const fakeThis = {
          draw: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        const runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        const options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.draw.called, 'to be true');
      });
    });

    describe("on 'end' event", function () {
      it('should call epilogue', function () {
        const fakeThis = {
          draw: noop,
          epilogue: sinon.stub().callsFake(noop),
          generateColors: noop
        };
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        runReporter(fakeThis, runner, options);

        expect(fakeThis.epilogue.called, 'to be true');
      });

      it('should write numberOfLines amount of newlines', function () {
        const expectedNumberOfLines = 4;
        const fakeThis = {
          draw: noop,
          epilogue: noop,
          generateColors: noop
        };
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        const stdout = runReporter(fakeThis, runner, options);

        const isBlankLine = function (value) {
          return value === '\n';
        };

        expect(
          stdout.filter(isBlankLine),
          'to have length',
          expectedNumberOfLines
        );
      });

      it('should call Base show', function () {
        const showCursorStub = sinon.stub(Base.cursor, 'show');
        const fakeThis = {
          draw: noop,
          epilogue: noop,
          generateColors: noop
        };
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(showCursorStub.called, 'to be true');
      });
    });
  });

  describe('#draw', function () {
    let stdoutWriteStub;
    let stdout;

    beforeEach(function () {
      stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk, encoding, cb) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    describe("when 'tick' is false", function () {
      it('should draw face with expected spaces, _ and ^', function () {
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);
        nyanCat.stats = {passes: 2, pending: 1, failures: 0};
        const fakeThis = {
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

        const expectedArray = [
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
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);
        nyanCat.stats = {passes: 2, pending: 1, failures: 0};
        const fakeThis = {
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

        const expectedArray = [
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
    let stdoutWriteStub;
    let stdout;

    beforeEach(function () {
      stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk, encoding, cb) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write cursor down interaction with expected number', function () {
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      const expectedNumber = 25;

      try {
        nyanCat.cursorDown(expectedNumber);
      } finally {
        sinon.restore();
      }

      const expectedArray = ['\u001b[' + expectedNumber + 'B'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('#cursorUp', function () {
    let stdoutWriteStub;
    let stdout;

    beforeEach(function () {
      stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk, encoding, cb) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write cursor up interaction with expected number', function () {
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      const expectedNumber = 25;

      try {
        nyanCat.cursorUp(expectedNumber);
      } finally {
        sinon.restore();
      }

      const expectedArray = ['\u001b[' + expectedNumber + 'A'];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('#rainbowify', function () {
    let useColorsStub;

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
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);

        const inputString = 'hello';
        const outputString = nyanCat.rainbowify(inputString);
        sinon.restore();

        const expectedString = inputString;
        expect(outputString, 'to be', expectedString);
      });
    });

    describe("when 'useColors' is true", function () {
      beforeEach(function () {
        useColorsStub.value(true);
      });

      it('should return rainbowified string from the given string and predefined codes', function () {
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);

        const inputString = 'hello';
        const colorCode = 'somecode';
        const fakeThis = {
          rainbowColors: [colorCode],
          colorIndex: 0
        };
        const outputString = nyanCat.rainbowify.call(fakeThis, inputString);
        sinon.restore();

        const startCode = '\u001b[38;5;';
        const endCode = '\u001b[0m';
        const expectedString =
          startCode + colorCode + 'm' + inputString + endCode;
        expect(outputString, 'to be', expectedString);
      });
    });
  });

  describe('#appendRainbow', function () {
    describe("when 'tick' is true", function () {
      it('should set an underscore segment', function () {
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);
        let expectedSegment;
        const inputArray = [];
        const trajectories = [inputArray, inputArray, inputArray, inputArray];
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
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);

        const rainbowifyResult = 'rainbowify';
        const inputArray = ['itemToShify'];
        const trajectories = [inputArray, inputArray, inputArray, inputArray];
        const expectedArray = [rainbowifyResult];
        const expectedTrajectories = [
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
        const runner = {on: noop, once: noop};
        const options = {};
        const nyanCat = new NyanCat(runner, options);
        let expectedSegment;
        const inputArray = [];
        const trajectories = [inputArray, inputArray, inputArray, inputArray];
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
    let stdout;

    beforeEach(function () {
      sinon.stub(Base, 'color').callsFake(function (type, n) {
        return type + n;
      });
      const stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk, encoding, cb) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write scoreboard with color set with each stat', function () {
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);

      const passes = 2;
      const pending = 1;
      const failures = 1;

      const fakeThis = {
        cursorUp: noop,
        stats: {passes, pending, failures},
        numberOfLines: 4
      };

      try {
        nyanCat.drawScoreboard.call(fakeThis);
      } finally {
        sinon.restore();
      }

      const expectedArray = [
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
      const expectedNumberOfLines = 1000;

      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      const fakeThis = {
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
    let stdout;

    beforeEach(function () {
      const stdoutWriteStub = sinon.stub(process.stdout, 'write');
      stdoutWriteStub.callsFake(function (chunk, encoding, cb) {
        stdout.push(chunk);
      });
      stdout = [];
    });

    it('should write width, contents and newline for each trajectory', function () {
      const expectedWidth = 444;

      const expectedContents = 'input';
      const inputArray = [expectedContents];
      const trajectories = [inputArray];
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      const fakeThis = {
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

      const expectedArray = [
        '\u001b[' + expectedWidth + 'C',
        expectedContents,
        '\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });

    it('should call cursorUp with given numberOfLines', function () {
      let expectedCursorArgument = null;
      const expectedNumberOfLines = 1000;

      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      const fakeThis = {
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
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 2, pending: 1, failures: 1};

      expect(nyanCat.face(), 'to be', '( x .x)');
    });

    it('should expect "( o .o)" if any pending but none failing', function () {
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 2, pending: 1, failures: 0};

      expect(nyanCat.face(), 'to be', '( o .o)');
    });

    it('should expect "( ^ .^)" if all passing', function () {
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 1, pending: 0, failures: 0};

      expect(nyanCat.face(), 'to be', '( ^ .^)');
    });

    it('should expect "( - .-)" otherwise', function (done) {
      const runner = {on: noop, once: noop};
      const options = {};
      const nyanCat = new NyanCat(runner, options);
      nyanCat.stats = {passes: 0, pending: 0, failures: 0};

      expect(nyanCat.face(), 'to be', '( - .-)');
      done();
    });
  });
});
