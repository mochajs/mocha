var assert = require('assert');

var Base   = require('../../lib/reporters/base')
  , Assert = require('assert').AssertionError;

function makeTest(err) {
  return {
    err: err,
    fullTitle: function () {
      return 'test title';
    }
  };
}

describe('Base reporter', function () {
  var stdout
    , stdoutWrite
    , useColors;

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

  describe('showDiff', function() {
    it('should show diffs by default', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' })
        , errOut;

      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      errOut.should.match(/\- actual/);
      errOut.should.match(/\+ expected/);
    });

    it('should show diffs if property set to `true`', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' })
        , errOut;

      err.showDiff = true;
      var test = makeTest(err);


      Base.list([test]);

      errOut = stdout.join('\n');
      errOut.should.match(/\- actual/);
      errOut.should.match(/\+ expected/);
    });

    it('should not show diffs when showDiff property set to `false`', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' })
        , errOut;

      err.showDiff = false;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      errOut.should.not.match(/\- actual/);
      errOut.should.not.match(/\+ expected/);
    });

    it('should not show diffs when expected is not defined', function () {
      var err = new Error('ouch')
        , errOut;

      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');
      errOut.should.not.match(/\- actual/);
      errOut.should.not.match(/\+ expected/);
    });

  });

  describe('Getting two strings', function() {
    // Fix regression V1.2.1(see: issue #1241)
    it('should show strings diff as is', function () {
      var err = new Error('test'),
        errOut;

      err.actual = 'foo\nbar';
      err.expected = 'foo\nbaz';
      err.showDiff = true;
      var test = makeTest(err);

      Base.list([test]);

      errOut = stdout.join('\n');

      errOut.should.not.match(/"foo\\nbar"/);
      errOut.should.match(/foo/).and.match(/bar/);
      errOut.should.match(/test/);
      errOut.should.match(/actual/);
      errOut.should.match(/expected/);
    });
  });

  it('should stringify objects', function () {
    var err = new Error('test'),
      errOut;

    err.actual = {key:"a1"};
    err.expected = {key:"e1"};
    err.showDiff = true;
    var test = makeTest(err);

    Base.list([test]);

    errOut = stdout.join('\n');
    errOut.should.match(/"key"/);
    errOut.should.match(/test/);
    errOut.should.match(/\- actual/);
    errOut.should.match(/\+ expected/);
  });

  it('should stringify Object.create(null)', function () {
    var err = new Error('test'),
      errOut;

    err.actual = Object.create(null);
    err.actual.hasOwnProperty = 1;
    err.expected = Object.create(null);
    err.expected.hasOwnProperty = 2;
    err.showDiff = true;
    var test = makeTest(err);

    Base.list([test]);

    errOut = stdout.join('\n');
    errOut.should.match(/"hasOwnProperty"/);
    errOut.should.match(/test/);
    errOut.should.match(/\- actual/);
    errOut.should.match(/\+ expected/);
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
      errOut.should.match(/\+true/);
      errOut.should.match(/\-false/);
      errOut.should.match(/\- actual/);
      errOut.should.match(/\+ expected/);
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
    errOut.should.equal('1) test title:\n     Error\n  foo\n  bar');
  });

  it('should use the inspect() property if `message` is not set', function () {
    var err = {
      showDiff: false,
      inspect: function() { return 'an error happened'; },
    };
    var test = makeTest(err);
    Base.list([test]);
    var errOut = stdout.join('\n').trim();
    errOut.should.equal('1) test title:\n     an error happened');
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
    errOut.should.equal('1) test title:\n     Error\n  foo\n  bar');
  });

});
