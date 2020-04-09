'use strict';

var assert = require('assert');
var chai = require('chai');
var sinon = require('sinon');
var helpers = require('./helpers');
var reporters = require('../../').reporters;
var AssertionError = assert.AssertionError;
var Base = reporters.Base;
var chaiExpect = chai.expect;
var createElements = helpers.createElements;
var makeTest = helpers.makeTest;

describe('Base reporter', function() {
  var sandbox;
  var stdout;

  function list(tests) {
    try {
      Base.list(tests);
    } finally {
      sandbox.restore();
    }
  }

  function generateDiff(actual, expected) {
    var diffStr;

    try {
      diffStr = Base.generateDiff(actual, expected);
    } finally {
      sandbox.restore();
    }

    return diffStr;
  }

  var gather = function(chunk, encoding, cb) {
    stdout.push(chunk);
  };

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    sandbox.stub(Base, 'useColors').value(false);
    sandbox.stub(process.stdout, 'write').callsFake(gather);
    stdout = [];
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('showDiff', function() {
    var err;

    beforeEach(function() {
      err = new AssertionError({actual: 'foo', expected: 'bar'});
    });

    it('should show diffs by default', function() {
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    });

    it("should show diffs if 'err.showDiff' is true", function() {
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    });

    it("should not show diffs if 'err.showDiff' is false", function() {
      err.showDiff = false;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });

    it("should not show diffs if 'expected' is not defined", function() {
      var _err = new Error('ouch');
      var test = makeTest(_err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });

    it("should not show diffs if 'hideDiff' is true", function() {
      var test = makeTest(err);

      sandbox.stub(Base, 'hideDiff').value(true);
      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'not to match', /- actual/);
      expect(errOut, 'not to match', /\+ expected/);
    });
  });

  describe('getting two strings', function() {
    // Fix regression V1.2.1(see: issue #1241)
    it('should show strings diff as is', function() {
      var err = new Error('test');
      err.actual = 'foo\nbar';
      err.expected = 'foo\nbaz';
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'not to match', /"foo\\nbar"/);
      expect(errOut, 'to match', /foo/).and('to match', /bar/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });
  });

  describe('diff generation', function() {
    var inlineDiffsStub;

    beforeEach(function() {
      inlineDiffsStub = sandbox.stub(Base, 'inlineDiffs');
    });

    it("should generate unified diffs if 'inlineDiffs' is false", function() {
      var actual = 'a foo unified diff';
      var expected = 'a bar unified diff';

      inlineDiffsStub.value(false);
      var output = generateDiff(actual, expected);

      expect(
        output,
        'to be',
        '\n      + expected - actual\n\n      -a foo unified diff\n      +a bar unified diff\n      '
      );
    });

    it("should generate inline diffs if 'inlineDiffs' is true", function() {
      var actual = 'a foo inline diff';
      var expected = 'a bar inline diff';

      inlineDiffsStub.value(true);
      var output = generateDiff(actual, expected);

      expect(
        output,
        'to be',
        '      \n      actual expected\n      \n      a foobar inline diff\n      '
      );
    });
  });

  describe('inline strings diff', function() {
    beforeEach(function() {
      sandbox.stub(Base, 'inlineDiffs').value(true);
    });

    it("should show single line diff if 'inlineDiffs' is true", function() {
      var err = new Error('test');
      err.actual = 'a foo inline diff';
      err.expected = 'a bar inline diff';
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'to match', /a foobar inline diff/);
      expect(errOut, 'to match', /test/);
      expect(errOut, 'to match', /actual/);
      expect(errOut, 'to match', /expected/);
    });

    it('should split lines if string has more than 4 line breaks', function() {
      var err = new Error('test');
      err.actual = 'a\nfoo\ninline\ndiff\nwith\nmultiple lines';
      err.expected = 'a\nbar\ninline\ndiff\nwith\nmultiple lines';
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
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

  describe('unified diff', function() {
    beforeEach(function() {
      sandbox.stub(Base, 'inlineDiffs').value(false);
    });

    it('should separate diff hunks by two dashes', function() {
      var err = new Error('test');
      err.actual = createElements({from: 2, to: 11});
      err.expected = createElements({from: 1, to: 10});
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');

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
    var err = new Error('test');
    err.actual = {key: 'a1'};
    err.expected = {key: 'e1'};
    err.showDiff = true;
    var test = makeTest(err);

    list([test]);

    var errOut = stdout.join('\n');
    expect(errOut, 'to match', /"key"/);
    expect(errOut, 'to match', /test/);
    expect(errOut, 'to match', /- actual/);
    expect(errOut, 'to match', /\+ expected/);
  });

  it('should stringify Object.create(null)', function() {
    var err = new Error('test');

    err.actual = Object.create(null);
    err.actual.hasOwnProperty = 1;
    err.expected = Object.create(null);
    err.expected.hasOwnProperty = 2;
    err.showDiff = true;
    var test = makeTest(err);

    list([test]);

    var errOut = stdout.join('\n');
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
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'to match', /\+true/);
      expect(errOut, 'to match', /-false/);
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    }
  });

  it("should interpret 'chai' module custom error messages", function() {
    var actual = 43;
    var expected = 42;

    try {
      chaiExpect(actual, 'custom error message').to.equal(expected);
    } catch (err) {
      err.actual = actual;
      err.expected = expected;
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'to match', /custom error message\n/)
        .and('to match', /\+42/)
        .and('to match', /-43/)
        .and('to match', /- actual/)
        .and('to match', /\+ expected/);
    }
  });

  it("should interpret 'assert' module custom error messages", function() {
    var actual = 43;
    var expected = 42;

    try {
      assert.strictEqual(actual, expected, 'custom error message');
      // AssertionError: custom error message: expected 43 to equal 42.
      // assert.equal(43, 42, 'custom error message: expected 43 to equal 42.');
    } catch (err) {
      err.actual = actual;
      err.expected = expected;
      err.showDiff = true;
      var test = makeTest(err);

      list([test]);

      var errOut = stdout.join('\n');
      expect(errOut, 'to match', /custom error message\n/);
      expect(errOut, 'to match', /\+42/);
      expect(errOut, 'to match', /-43/);
      expect(errOut, 'to match', /- actual/);
      expect(errOut, 'to match', /\+ expected/);
    }
  });

  it('should remove message from stack', function() {
    var err = {
      message: 'Error',
      stack: 'Error\nfoo\nbar',
      showDiff: false
    };
    var test = makeTest(err);

    list([test]);

    var errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
  });

  it("should use 'inspect' if 'message' is not set", function() {
    var err = {
      showDiff: false,
      inspect: function() {
        return 'an error happened';
      }
    };
    var test = makeTest(err);

    list([test]);

    var errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     an error happened');
  });

  it("should set an empty message if neither 'message' nor 'inspect' is set", function() {
    var err = {
      showDiff: false
    };
    var test = makeTest(err);

    list([test]);

    var errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:');
  });

  it('should not modify stack if it does not contain message', function() {
    var err = {
      message: 'Error',
      stack: 'foo\nbar',
      showDiff: false
    };
    var test = makeTest(err);

    list([test]);

    var errOut = stdout.join('\n').trim();
    expect(errOut, 'to be', '1) test title:\n     Error\n  foo\n  bar');
  });

  it('should list multiple Errors per test', function() {
    var err = new Error('First Error');
    err.multiple = [new Error('Second Error - same test')];
    var test = makeTest(err);

    list([test, test]);

    var errOut = stdout.join('\n').trim();
    expect(
      errOut,
      'to contain',
      'Error: First Error',
      'Error: Second Error - same test'
    );
  });

  describe('when reporter output immune to user test changes', function() {
    var baseConsoleLog;

    beforeEach(function() {
      sandbox.stub(console, 'log');
      baseConsoleLog = sandbox.stub(Base, 'consoleLog');
    });

    it('should let you stub out console.log without effecting reporters output', function() {
      Base.list([]);

      expect(baseConsoleLog, 'was called');
      expect(console.log, 'was not called');
      sandbox.restore();
    });
  });

  describe('epilogue', function() {
    it('should include "pending" count', function() {
      var ctx = {stats: {passes: 0, pending: 2, skipped: 0, duration: 12}};
      var epilogue = Base.prototype.epilogue.bind(ctx);

      epilogue();
      sandbox.restore();

      var out = stdout.join('\n').trim();
      expect(out, 'to contain', '2 pending').and('not to contain', 'skipped');
    });

    it('should include "skipped" count', function() {
      var ctx = {stats: {passes: 0, pending: 0, skipped: 3, duration: 12}};
      var epilogue = Base.prototype.epilogue.bind(ctx);

      epilogue();
      sandbox.restore();

      var out = stdout.join('\n').trim();
      expect(out, 'to contain', '3 skipped').and('not to contain', 'pending');
    });
  });
});
