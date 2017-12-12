'use strict';

var assert = require('assert');

var Base = require('../../lib/reporters/base');
var Assert = require('assert').AssertionError;

function makeTest (err) {
  return {
    err: err,
    titlePath: function () {
      return ['test title'];
    }
  };
}

function createElements (argObj) {
  var res = [];
  for (var i = argObj.from; i <= argObj.to; i += 1) {
    res.push('element ' + i);
  }
  return res;
}

describe('Base reporter', function () {
  var stdout;
  var stdoutWrite;
  var useColors;

  beforeEach(function () {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function () {
    process.stdout.write = stdoutWrite;
    Base.useColors = useColors;
  });

  describe('showDiff', function () {
    it('should show diffs by default', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' });
      var errOut;

      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      expect(errOut).to.match(/- actual/);
      expect(errOut).to.match(/\+ expected/);
    });

    it('should show diffs if property set to `true`', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' });
      var errOut;

      err.showDiff = true;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      expect(errOut).to.match(/- actual/);
      expect(errOut).to.match(/\+ expected/);
    });

    it('should not show diffs when showDiff property set to `false`', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' });
      var errOut;

      err.showDiff = false;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      expect(errOut).to.not.match(/- actual/);
      expect(errOut).to.not.match(/\+ expected/);
    });

    it('should not show diffs when expected is not defined', function () {
      var err = new Error('ouch');
      var errOut;

      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      expect(errOut).to.not.match(/- actual/);
      expect(errOut).to.not.match(/\+ expected/);
    });

    it('should not show diffs when hideDiff is set', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' });
      var errOut;

      var test = makeTest(err);

      Base.hideDiff = true;
      Base.list([test]);
      Base.hideDiff = false; // Revert to original value

      errOut = stdout.join('\n');
      expect(errOut).to.not.match(/- actual/);
      expect(errOut).to.not.match(/\+ expected/);
    });
  });

  describe('Getting two strings', function () {
    // Fix regression V1.2.1(see: issue #1241)
    it('should show strings diff as is', function () {
      var err = new Error('test');
      var errOut;

      err.actual = 'foo\nbar';
      err.expected = 'foo\nbaz';
      err.showDiff = true;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');

      expect(errOut).to.not.match(/"foo\\nbar"/);
      expect(errOut).to.match(/foo/).and.match(/bar/);
      expect(errOut).to.match(/test/);
      expect(errOut).to.match(/actual/);
      expect(errOut).to.match(/expected/);
    });
  });

  describe('Inline strings diff', function () {
    it('should show single line diff if property set to `true`', function () {
      var err = new Error('test');
      var errOut;

      err.actual = 'a foo inline diff';
      err.expected = 'a bar inline diff';
      err.showDiff = true;
      var test = makeTest(err);

      Base.inlineDiffs = true;
      Base.list([test]);

      errOut = stdout.join('\n');

      expect(errOut).to.match(/a foobar inline diff/);
      expect(errOut).to.match(/test/);
      expect(errOut).to.match(/actual/);
      expect(errOut).to.match(/expected/);
    });

    it('should split lines when string has more than 4 line breaks', function () {
      var err = new Error('test');
      var errOut;

      err.actual = 'a\nfoo\ninline\ndiff\nwith\nmultiple lines';
      err.expected = 'a\nbar\ninline\ndiff\nwith\nmultiple lines';
      err.showDiff = true;
      var test = makeTest(err);

      Base.inlineDiffs = true;
      Base.list([test]);

      errOut = stdout.join('\n');

      expect(errOut).to.match(/1 \| a/);
      expect(errOut).to.match(/2 \| foobar/);
      expect(errOut).to.match(/3 \| inline/);
      expect(errOut).to.match(/4 \| diff/);
      expect(errOut).to.match(/5 \| with/);
      expect(errOut).to.match(/6 \| multiple lines/);
      expect(errOut).to.match(/test/);
      expect(errOut).to.match(/actual/);
      expect(errOut).to.match(/expected/);
    });
  });

  describe('unified diff reporter', function () {
    it('should separate diff hunks by two dashes', function () {
      var err = new Error('test');
      var errOut;

      err.actual = createElements({ from: 2, to: 11 });
      err.expected = createElements({ from: 1, to: 10 });
      err.showDiff = true;
      var test = makeTest(err);

      Base.inlineDiffs = false;
      Base.list([test]);

      errOut = stdout.join('\n');

      var regexesToMatch = [
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
        expect(errOut).to.match(aRegex);
      });
    });
  });

  it('should stringify objects', function () {
    var err = new Error('test');
    var errOut;

    err.actual = {key: 'a1'};
    err.expected = {key: 'e1'};
    err.showDiff = true;
    var test = makeTest(err);

    Base.list([test]);

    errOut = stdout.join('\n');
    expect(errOut).to.match(/"key"/);
    expect(errOut).to.match(/test/);
    expect(errOut).to.match(/- actual/);
    expect(errOut).to.match(/\+ expected/);
  });

  it('should stringify Object.create(null)', function () {
    var err = new Error('test');
    var errOut;

    err.actual = Object.create(null);
    err.actual.hasOwnProperty = 1;
    err.expected = Object.create(null);
    err.expected.hasOwnProperty = 2;
    err.showDiff = true;
    var test = makeTest(err);

    Base.list([test]);

    errOut = stdout.join('\n');
    expect(errOut).to.match(/"hasOwnProperty"/);
    expect(errOut).to.match(/test/);
    expect(errOut).to.match(/- actual/);
    expect(errOut).to.match(/\+ expected/);
  });

  it('should handle error messages that are not strings', function () {
    var errOut;

    try {
      assert(false, true);
    } catch (err) {
      err.actual = false;
      err.expected = true;
      err.showDiff = true;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      expect(errOut).to.match(/\+true/);
      expect(errOut).to.match(/-false/);
      expect(errOut).to.match(/- actual/);
      expect(errOut).to.match(/\+ expected/);
    }
  });

  it('should interpret chaijs custom error messages', function () {
    var errOut;

    try {
      // expect(43, 'custom error message').to.equal(42);
      // AssertionError: custom error message: expected 43 to equal 42.
      assert.equal(43, 42, 'custom error message: expected 43 to equal 42.');
    } catch (err) {
      err.actual = 43;
      err.expected = 42;
      err.showDiff = true;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      expect(errOut).to.match(/custom error message\n/);
      expect(errOut).to.match(/\+42/);
      expect(errOut).to.match(/-43/);
      expect(errOut).to.match(/- actual/);
      expect(errOut).to.match(/\+ expected/);
    }
  });

  it('should remove message from stack', function () {
    var err = {
      message: 'Error',
      stack: 'Error\nfoo\nbar',
      showDiff: false
    };
    var test = makeTest(err);

    Base.list([test]);

    var errOut = stdout.join('\n').trim();
    expect(errOut).to.equal('1) test title:\n     Error\n  foo\n  bar');
  });

  it('should use the inspect() property if `message` is not set', function () {
    var err = {
      showDiff: false,
      inspect: function () { return 'an error happened'; }
    };
    var test = makeTest(err);
    Base.list([test]);
    var errOut = stdout.join('\n').trim();
    expect(errOut).to.equal('1) test title:\n     an error happened');
  });

  it('should set an empty message if `message` and `inspect()` are not set', function () {
    var err = {
      showDiff: false
    };
    var test = makeTest(err);
    Base.list([test]);
    var errOut = stdout.join('\n').trim();
    expect(errOut).to.equal('1) test title:');
  });

  it('should not modify stack if it does not contain message', function () {
    var err = {
      message: 'Error',
      stack: 'foo\nbar',
      showDiff: false
    };
    var test = makeTest(err);

    Base.list([test]);

    var errOut = stdout.join('\n').trim();
    expect(errOut).to.equal('1) test title:\n     Error\n  foo\n  bar');
  });
});
