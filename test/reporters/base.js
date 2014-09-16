var Base = require('../../lib/reporters/base');

describe('Base reporter', function () {

  it('should show diffs with showDiff property set', function () {
    var err = new Error('test'),
      stderr = [],
      stderrWrite = process.stderr.write,
      errOut;

    err.actual = "a1";
    err.expected = "e1";
    err.showDiff = true;
    var test = {
      err: err,
      fullTitle: function () {
        return 'title';
      }
    };

    process.stderr.write = function (string) {
      stderr.push(string);
    };

    Base.list([test]);

    process.stderr.write = stderrWrite;

    errOut = stderr.join('\n');

    errOut.should.match(/test/);
    errOut.should.match(/actual/);
    errOut.should.match(/expected/);

  });

  it('should not show diffs when showDiff property set', function () {
    var err = new Error('test'),
      stderr = [],
      stderrWrite = process.stderr.write,
      errOut;

    err.actual = "a1";
    err.expected = "e1";
    err.showDiff = false;
    var test = {
      err: err,
      fullTitle: function () {
        return 'title';
      }
    };

    process.stderr.write = function (string) {
      stderr.push(string);
    };

    Base.list([test]);

    process.stderr.write = stderrWrite;

    errOut = stderr.join('\n');

    errOut.should.match(/test/);
    errOut.should.not.match(/actual/);
    errOut.should.not.match(/expected/);

  });
});
