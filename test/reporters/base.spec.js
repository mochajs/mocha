'use strict';

var assert = require('assert');

var Base = require('../../lib/reporters/base');
var AssertionError = assert.AssertionError;
var makeTest = require('./helpers').makeTest;
var createElements = require('./helpers').createElements;

describe('Base reporter', function() {
  var stdout;
  var stdoutWrite;
  var useColors;
  var err;
  var errOut;
  var test;

  function list(tests) {
    Base.useColors = false;
    var retval = Base.list(tests);
    Base.useColors = useColors;
    return retval;
  }

  function generateDiff(actual, expected) {
    Base.useColors = false;
    var retval = Base.generateDiff(actual, expected);
    Base.useColors = useColors;
    return retval;
  }

  beforeEach(function() {
    useColors = Base.useColors;
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
  });

  afterEach(function() {
    process.stdout.write = stdoutWrite;
  });

  describe('showDiff', function() {
    beforeEach(function() {
      err = new AssertionError({actual: 'foo', expected: 'bar'});
    });

    it('should show diffs by default', function() {
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    });

    it('should show diffs if property set to `true`', function() {
      err.showDiff = true;
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    });

    it('should not show diffs when showDiff property set to `false`', function() {
      err.showDiff = false;
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });

    it('should not show diffs when expected is not defined', function() {
      err = new Error('ouch');

      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });

    it('should not show diffs when hideDiff is set', function() {
      test = makeTest(err);

      Base.hideDiff = true;
      list([test]);
      Base.hideDiff = false; // Revert to original value

      errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });
  });

  describe('Getting two strings', function() {
    // Fix regression V1.2.1(see: issue #1241)
    it('should show strings diff as is', function() {
      err = new Error('test');

      err.actual = 'foo\nbar';
      err.expected = 'foo\nbaz';
      err.showDiff = true;
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');

      expect(errOut, 'not to match', /"foo\\nbar"/);
      expect(errOut, 'to match', /foo/).and('to match', /bar/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });
  });

  describe('Diff generation', function() {
    var oldInlineDiffs;
    var actual;
    var expected;
    var output;

    beforeEach(function() {
      oldInlineDiffs = Base.inlineDiffs;
    });

    afterEach(function() {
      Base.inlineDiffs = oldInlineDiffs;
    });

    it('should generate unified diffs if `inlineDiff === false`', function() {
      actual = 'a foo unified diff';
      expected = 'a bar unified diff';

      Base.inlineDiffs = false;
      output = generateDiff(actual, expected);

      expect(
        output,
        'to be',
        '\n      + expected - actual\n\n      -a foo unified diff\n      +a bar unified diff\n      '
      );
    });

    it('should generate inline diffs if `inlineDiffs === true`', function() {
      actual = 'a foo inline diff';
      expected = 'a bar inline diff';

      Base.inlineDiffs = true;
      output = generateDiff(actual, expected);

      expect(
        output,
        'to be',
        '      \n      actual expected\n      \n      a foobar inline diff\n      '
      );
    });
  });

  describe('Inline strings diff', function() {
    it('should show single line diff if property set to `true`', function() {
      err = new Error('test');

      err.actual = 'a foo inline diff';
      err.expected = 'a bar inline diff';
      err.showDiff = true;
      test = makeTest(err);

      Base.inlineDiffs = true;
      list([test]);

      errOut = stdout.join('\n');

      expect(errOut, 'to match', /a foobar inline diff/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });

    it('should split lines when string has more than 4 line breaks', function() {
      err = new Error('test');

      err.actual = 'a\nfoo\ninline\ndiff\nwith\nmultiple lines';
      err.expected = 'a\nbar\ninline\ndiff\nwith\nmultiple lines';
      err.showDiff = true;
      test = makeTest(err);

      Base.inlineDiffs = true;
      list([test]);

      errOut = stdout.join('\n');

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

  describe('unified diff reporter', function() {
    beforeEach(function() {
      err = new Error('test');
    });

    it('should separate diff hunks by two dashes', function() {
      err.actual = createElements({from: 2, to: 11});
      err.expected = createElements({from: 1, to: 10});
      err.showDiff = true;
      test = makeTest(err);

      Base.inlineDiffs = false;
      list([test]);

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

      regexesToMatch.forEach(function(aRegex) {
        expect(errOut, 'to match', aRegex);
      });
    });
  });

  it('should stringify objects', function() {
    err = new Error('test');

    err.actual = {key: 'a1'};
    err.expected = {key: 'e1'};
    err.showDiff = true;
    test = makeTest(err);

    list([test]);

    errOut = stdout.join('\n');
    expect(errOut, 'to match', /"key"/);
    expect(errOut, 'to match', /test/);
    expect(errOut, 'to match', /- actual/);
    expect(errOut, 'to match', /\+ expected/);
  });

  it('should stringify Object.create(null)', function() {
    err = new Error('test');

    err.actual = Object.create(null);
    err.actual.hasOwnProperty = 1;
    err.expected = Object.create(null);
    err.expected.hasOwnProperty = 2;
    err.showDiff = true;
    test = makeTest(err);

    list([test]);

    errOut = stdout.join('\n');
    expect(errOut, 'to match', /"hasOwnProperty"/);
    expect(errOut, 'to match', /test/);
    expect(errOut, 'to match', /- actual/);
    expect(errOut, 'to match', /\+ expected/);
  });

  it('should handle error messages that are not strings', function() {
    try {
      assert(false, true);
    } catch (err) {
      err.actual = false;
      err.expected = true;
      err.showDiff = true;
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'to match', /\+true/);
      expect(errOut, 'to match', /-false/);
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    }
  });

  it('should interpret Chai custom error messages', function() {
    var chaiExpect = require('chai').expect;
    try {
      chaiExpect(43, 'custom error message').to.equal(42);
    } catch (err) {
      err.actual = 43;
      err.expected = 42;
      err.showDiff = true;
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'to match', /custom error message\n/)
        .and('to match', /\+42/)
        .and('to match', /-43/)
        .and('to match', /- actual/)
        .and('to match', /\+ expected/);
    }
  });

  it('should interpret assert module custom error messages', function() {
    try {
      assert.equal(43, 42, 'custom error message');
      // AssertionError: custom error message: expected 43 to equal 42.
      // assert.equal(43, 42, 'custom error message: expected 43 to equal 42.');
    } catch (err) {
      err.actual = 43;
      err.expected = 42;
      err.showDiff = true;
      test = makeTest(err);

      list([test]);

      errOut = stdout.join('\n');
      expect(errOut, 'to match', /custom error message\n/);
      expect(errOut, 'to match', /\+42/);
      expect(errOut, 'to match', /-43/);
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    }
  });

  it('should remove message from stack', function() {
    err = {
      message: 'Error',
      stack: 'Error\nfoo\nbar',
      showDiff: false
    };
    test = makeTest(err);

    list([test]);

    errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
  });

  it('should use the inspect() property if `message` is not set', function() {
    err = {
      showDiff: false,
      inspect: function() {
        return 'an error happened';
      }
    };
    test = makeTest(err);
    list([test]);
    errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     an error happened');
  });

  it('should set an empty message if `message` and `inspect()` are not set', function() {
    err = {
      showDiff: false
    };
    test = makeTest(err);
    list([test]);
    errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:');
  });

  it('should not modify stack if it does not contain message', function() {
    err = {
      message: 'Error',
      stack: 'foo\nbar',
      showDiff: false
    };
    test = makeTest(err);

    list([test]);

    errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
  });
});
