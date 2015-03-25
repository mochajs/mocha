var Base   = require('../../lib/reporters/base')
  , Assert = require('assert').AssertionError;

describe('Base reporter', function () {

  describe('showDiff', function() {
    it('should show diffs by default', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' })
        , stdout = []
        , stdoutWrite = process.stdout.write
        , errOut;

      var test = {
        err: err,
        fullTitle: function () {
          return 'test title';
        }
      };

      process.stdout.write = function (string) {
        stdout.push(string);
      };

      Base.list([test]);

      process.stdout.write = stdoutWrite;

      errOut = stdout.join('\n');
      errOut.should.match(/actual/);
      errOut.should.match(/expected/);
    });

    it('should show diffs if property set to `true`', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' })
        , stdout = []
        , stdoutWrite = process.stdout.write
        , errOut;

      err.showDiff = true;
      var test = {
        err: err,
        fullTitle: function () {
          return 'test title';
        }
      };

      process.stdout.write = function (string) {
        stdout.push(string);
      };

      Base.list([test]);

      process.stdout.write = stdoutWrite;

      errOut = stdout.join('\n');
      errOut.should.match(/actual/);
      errOut.should.match(/expected/);
    });

    it('should not show diffs when showDiff property set to `false`', function () {
      var err = new Assert({ actual: 'foo', expected: 'bar' })
        , stdout = []
        , stdoutWrite = process.stdout.write
        , errOut;

      err.showDiff = false;
      var test = {
        err: err,
        fullTitle: function () {
          return 'test title';
        }
      };

      process.stdout.write = function (string) {
        stdout.push(string);
      };

      Base.list([test]);

      process.stdout.write = stdoutWrite;

      errOut = stdout.join('\n');
      errOut.should.not.match(/actual/);
      errOut.should.not.match(/expected/);
    });
  });

  it('should not stringify strings', function () {
    var err = new Error('test'),
      stdout = [],
      stdoutWrite = process.stdout.write,
      errOut;

    err.actual = "a1";
    err.expected = "e2";
    err.showDiff = true;
    var test = {
      err: err,
      fullTitle: function () {
        return 'title';
      }
    };

    process.stdout.write = function (string) {
      stdout.push(string);
    };

    Base.list([test]);

    process.stdout.write = stdoutWrite;

    errOut = stdout.join('\n');

    errOut.should.not.match(/"/);
    errOut.should.match(/test/);
    errOut.should.match(/actual/);
    errOut.should.match(/expected/);

  });


  it('should stringify objects', function () {
    var err = new Error('test'),
      stdout = [],
      stdoutWrite = process.stdout.write,
      errOut;

    err.actual = {key:"a1"};
    err.expected = {key:"e1"};
    err.showDiff = true;
    var test = {
      err: err,
      fullTitle: function () {
        return 'title';
      }
    };

    process.stdout.write = function (string) {
      stdout.push(string);
    };

    Base.list([test]);

    process.stdout.write = stdoutWrite;

    errOut = stdout.join('\n');

    errOut.should.match(/"key"/);
    errOut.should.match(/test/);
    errOut.should.match(/actual/);
    errOut.should.match(/expected/);
  });
});
