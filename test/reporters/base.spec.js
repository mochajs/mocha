'use strict';

const assert = require('node:assert');
const chai = require('chai');
const sinon = require('sinon');
const helpers = require('./helpers');
const reporters = require('../../').reporters;
const AssertionError = assert.AssertionError;
const Base = reporters.Base;
const chaiExpect = chai.expect;
const createElements = helpers.createElements;
const makeTest = helpers.makeTest;
const Mocha = require('../../');
const Suite = Mocha.Suite;
const Runner = Mocha.Runner;

describe('Base reporter', function () {
  let stdout;

  function list(tests) {
    try {
      Base.list(tests);
    } finally {
      sinon.restore();
    }
  }

  function generateDiff(actual, expected) {
    let diffStr;

    try {
      diffStr = Base.generateDiff(actual, expected);
    } finally {
      sinon.restore();
    }

    return diffStr;
  }

  const gather = function (chunk, encoding, cb) {
    stdout.push(chunk);
  };

  beforeEach(function () {
    sinon.stub(Base, 'useColors').value(false);
    sinon.stub(process.stdout, 'write').callsFake(gather);
    stdout = [];
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('showDiff', function () {
    let err;

    beforeEach(function () {
      err = new AssertionError({actual: 'foo', expected: 'bar'});
    });

    it('should show diffs by default', function () {
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    });

    it("should show diffs if 'err.showDiff' is true", function () {
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    });

    it("should not show diffs if 'err.showDiff' is false", function () {
      err.showDiff = false;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });

    it("should not show diffs if 'expected' is not defined", function () {
      const _err = new Error('ouch');
      const test = makeTest(_err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });

    it("should not show diffs if 'hideDiff' is true", function () {
      const test = makeTest(err);

      sinon.stub(Base, 'hideDiff').value(true);
      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });
  });

  describe('getting two strings', function () {
    // Fix regression V1.2.1(see: issue #1241)
    it('should show strings diff as is', function () {
      const err = new Error('test');
      err.actual = 'foo\nbar';
      err.expected = 'foo\nbaz';
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'not to match', /"foo\\nbar"/);
      expect(errOut, 'to match', /foo/).and('to match', /bar/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });
  });

  describe('diff generation', function () {
    let inlineDiffsStub;

    beforeEach(function () {
      inlineDiffsStub = sinon.stub(Base, 'inlineDiffs').value(false);
    });

    it("should generate unified diffs if 'inlineDiffs' is false", function () {
      const actual = 'a foo unified diff';
      const expected = 'a bar unified diff';

      const output = generateDiff(actual, expected);

      expect(
        output,
        'to be',
        '\n      + expected - actual\n\n      -a foo unified diff\n      +a bar unified diff\n      '
      );
    });

    it("should generate inline diffs if 'inlineDiffs' is true", function () {
      const actual = 'a foo inline diff';
      const expected = 'a bar inline diff';

      inlineDiffsStub.value(true);
      const output = generateDiff(actual, expected);

      expect(
        output,
        'to be',
        '      \n      actual expected\n      \n      a foobar inline diff\n      '
      );
    });

    it("should truncate overly long 'actual' ", function () {
      let actual = '';
      let i = 0;
      while (i++ < 500) {
        actual += 'a foo unified diff ';
      }
      const expected = 'a bar unified diff';

      const output = generateDiff(actual, expected);

      expect(output, 'to match', /output truncated/);
    });

    it("should truncate overly long 'expected' ", function () {
      const actual = 'a foo unified diff';
      let expected = '';
      let i = 0;
      while (i++ < 500) {
        expected += 'a bar unified diff ';
      }

      const output = generateDiff(actual, expected);

      expect(output, 'to match', /output truncated/);
    });

    it("should not truncate overly long 'actual' if maxDiffSize=0", function () {
      let actual = '';
      let i = 0;
      while (i++ < 120) {
        actual += 'a bar unified diff ';
      }
      const expected = 'b foo unified diff';

      sinon.stub(Base, 'maxDiffSize').value(0);
      const output = generateDiff(actual, expected);

      expect(output, 'not to match', /output truncated/);
    });

    it("should not truncate overly long 'expected' if maxDiffSize=0", function () {
      const actual = 'a foo unified diff';
      let expected = '';
      let i = 0;
      while (i++ < 120) {
        expected += 'a bar unified diff ';
      }

      sinon.stub(Base, 'maxDiffSize').value(0);
      const output = generateDiff(actual, expected);

      expect(output, 'not to match', /output truncated/);
    });
  });

  describe('inline strings diff', function () {
    beforeEach(function () {
      sinon.stub(Base, 'inlineDiffs').value(true);
    });

    it("should show single line diff if 'inlineDiffs' is true", function () {
      const err = new Error('test');
      err.actual = 'a foo inline diff';
      err.expected = 'a bar inline diff';
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /a foobar inline diff/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });

    it('should split lines if string has more than 4 line breaks', function () {
      const err = new Error('test');
      err.actual = 'a\nfoo\ninline\ndiff\nwith\nmultiple lines';
      err.expected = 'a\nbar\ninline\ndiff\nwith\nmultiple lines';
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /1 \| a/);
      expect(errOut, 'to match', /2 \| foobar/);
      expect(errOut, 'to match', /3 \| inline/);
      expect(errOut, 'to match', /4 \| diff/);
      expect(errOut, 'to match', /5 \| with/);
      expect(errOut, 'to match', /6 \| multiple lines/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });
  });

  describe('unified diff', function () {
    beforeEach(function () {
      sinon.stub(Base, 'inlineDiffs').value(false);
    });

    it('should separate diff hunks by two dashes', function () {
      const err = new Error('test');
      err.actual = createElements({from: 2, to: 11});
      err.expected = createElements({from: 1, to: 10});
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');

      const regexesToMatch = [
        /\[/,
        /\+ {2}"element 1"/,
        /"element 2"/,
        /"element 3"/,
        /"element 4"/,
        /"element 5"/,
        /--/,
        /"element 7"/,
        /"element 8"/,
        /"element 9"/,
        /"element 10"/,
        /- {2}"element 11"/,
        /]/,
        /test/,
        /expected/,
        /actual/
      ];

      regexesToMatch.forEach(function (aRegex) {
        expect(errOut, 'to match', aRegex);
      });
    });
  });

  describe("when 'reporterOption.maxDiffSize' is provided", function () {
    let origSize;

    beforeEach(function () {
      sinon.restore();
      origSize = Base.maxDiffSize;
    });

    afterEach(function () {
      Base.maxDiffSize = origSize;
    });

    it("should set 'Base.maxDiffSize' used for truncating diffs", function () {
      const options = {
        reporterOption: {
          maxDiffSize: 4
        }
      };
      const suite = new Suite('Dummy suite', 'root');
      const runner = new Runner(suite);
      // eslint-disable-next-line no-unused-vars
      const base = new Base(runner, options);
      expect(Base.maxDiffSize, 'to be', 4);
    });
  });

  it('should stringify objects', function () {
    const err = new Error('test');
    err.actual = {key: 'a1'};
    err.expected = {key: 'e1'};
    err.showDiff = true;
    const test = makeTest(err);

    list([test]);

    const errOut = stdout.join('\n');
    expect(errOut, 'to match', /"key"/);
    expect(errOut, 'to match', /test/);
    expect(errOut, 'to match', /- actual/);
    expect(errOut, 'to match', /\+ expected/);
  });

  it('should stringify Object.create(null)', function () {
    const err = new Error('test');

    err.actual = Object.create(null);
    err.actual.hasOwnProperty = 1;
    err.expected = Object.create(null);
    err.expected.hasOwnProperty = 2;
    err.showDiff = true;
    const test = makeTest(err);

    list([test]);

    const errOut = stdout.join('\n');
    expect(errOut, 'to match', /"hasOwnProperty"/);
    expect(errOut, 'to match', /test/);
    expect(errOut, 'to match', /- actual/);
    expect(errOut, 'to match', /\+ expected/);
  });

  it('should handle error messages that are not strings', function () {
    try {
      assert(false, true);
    } catch (err) {
      err.actual = false;
      err.expected = true;
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /\+true/);
      expect(errOut, 'to match', /-false/);
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    }
  });

  it("should interpret 'chai' module custom error messages", function () {
    const actual = 43;
    const expected = 42;

    try {
      chaiExpect(actual, 'custom error message').to.equal(expected);
    } catch (err) {
      err.actual = actual;
      err.expected = expected;
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /custom error message\n/)
        .and('to match', /\+42/)
        .and('to match', /-43/)
        .and('to match', /- actual/)
        .and('to match', /\+ expected/);
    }
  });

  it("should interpret 'assert' module custom error messages", function () {
    const actual = 43;
    const expected = 42;

    try {
      assert.strictEqual(actual, expected, 'custom error message');
      // AssertionError: custom error message: expected 43 to equal 42.
      // assert.equal(43, 42, 'custom error message: expected 43 to equal 42.');
    } catch (err) {
      err.actual = actual;
      err.expected = expected;
      err.showDiff = true;
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n');
      expect(errOut, 'to match', /custom error message\n/);
      expect(errOut, 'to match', /\+42/);
      expect(errOut, 'to match', /-43/);
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    }
  });

  it('should remove message from stack', function () {
    const err = {
      message: 'Error',
      stack: 'Error\nfoo\nbar',
      showDiff: false
    };
    const test = makeTest(err);

    list([test]);

    const errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
  });

  it("should use 'inspect' if 'inspect' and 'message' are set", function () {
    const err = new Error('test');
    err.showDiff = false;
    err.message = 'error message';
    err.inspect = function () {
      return 'Inspect Error';
    };

    const test = makeTest(err);

    list([test]);

    const errOut = stdout.join('\n').trim();

    expect(errOut, 'to contain', 'Inspect Error');
  });

  it("should set an empty message if neither 'inspect' nor 'message' is set", function () {
    const err = {
      showDiff: false
    };
    const test = makeTest(err);

    list([test]);

    const errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:');
  });

  it('should not modify stack if it does not contain message', function () {
    const err = {
      message: 'Error',
      stack: 'foo\nbar',
      showDiff: false
    };
    const test = makeTest(err);

    list([test]);

    const errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
  });

  describe('error causes', function () {
    it('should append any error cause trail to stack traces', function () {
      const err = {
        message: 'Error',
        stack: 'Error\nfoo\nbar',
        showDiff: false,
        cause: {
          message: 'Cause1',
          stack: 'Cause1\nbar\nfoo',
          showDiff: false,
          cause: {
            message: 'Cause2',
            stack: 'Cause2\nabc\nxyz',
            showDiff: false
          }
        }
      };
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n').trim();
      expect(
        errOut,
        'to be',
        '1) test title:\n     Error\n  foo\n  bar\n     Caused by: Cause1\n  bar\n  foo\n     Caused by: Cause2\n  abc\n  xyz'
      );
    });

    it('should not get stuck in a hypothetical circular error cause trail', function () {
      const err1 = {
        message: 'Error',
        stack: 'Error\nfoo\nbar',
        showDiff: false,
      };
      const err2 = {
        message: 'Cause1',
        stack: 'Cause1\nbar\nfoo',
        showDiff: false,
        cause: err1
      }
      err1.cause = err2;

      const test = makeTest(err1);

      list([test]);

      const errOut = stdout.join('\n').trim();
      expect(
        errOut,
        'to be',
        '1) test title:\n     Error\n  foo\n  bar\n     Caused by: Cause1\n  bar\n  foo\n     Caused by: <circular>'
      );
    });

    it("should set an empty cause if neither 'inspect' nor 'message' is set", function () {
      const err = {
        message: 'Error',
        stack: 'Error\nfoo\nbar',
        showDiff: false,
        cause: {
          showDiff: false,
        }
      };

      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n').trim();
      expect(
        errOut,
        'to be',
        '1) test title:\n     Error\n  foo\n  bar\n     Caused by:'
      );
    });

    it('should not add cause trail if error does not contain message', function () {
      const err = {
        message: 'Error',
        stack: 'foo\nbar',
        showDiff: false,
        cause: {
          message: 'Cause1',
          stack: 'Cause1\nbar\nfoo',
          showDiff: false,
          cause: {
            message: 'Cause2',
            stack: 'Cause2\nabc\nxyz',
            showDiff: false
          }
        }
      };
      const test = makeTest(err);

      list([test]);

      const errOut = stdout.join('\n').trim();
      expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
    });
  });

  it('should list multiple Errors per test', function () {
    const err = new Error('First Error');
    err.multiple = [new Error('Second Error - same test')];
    const test = makeTest(err);

    list([test, test]);

    const errOut = stdout.join('\n').trim();
    expect(
      errOut,
      'to contain',
      'Error: First Error',
      'Error: Second Error - same test'
    );
  });

  describe('when reporter output immune to user test changes', function () {
    let baseConsoleLog;

    beforeEach(function () {
      sinon.restore();
      sinon.stub(console, 'log');
      baseConsoleLog = sinon.stub(Base, 'consoleLog');
    });

    it('should let you stub out console.log without effecting reporters output', function () {
      Base.list([]);
      baseConsoleLog.restore();

      expect(baseConsoleLog, 'was called');
      expect(console.log, 'was not called');
    });
  });
});
