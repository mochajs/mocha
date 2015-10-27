var assert = require('assert');
var os     = require('os');
var fs     = require('fs');
var crypto = require('crypto');
var path   = require('path');
var run    = require('./helpers').runMocha;

describe('reporters', function() {
  this.timeout(3000);

  describe('markdown', function() {
    var res;

    before(function(done) {
      run('passing.js', ['--reporter', 'markdown'], function(err, result) {
        res = result;
        done(err);
      });
    });

    it('does not exceed maximum callstack (issue: 1875)', function() {
      assert(res.output.indexOf('RangeError') === -1, 'Threw RangeError');
    });

    it('contains spec src', function() {
      var src = [
        '```js',
        'assert(true);',
        '```'
      ].join('\n');

      assert(res.output.indexOf(src) !== -1, 'No assert found');
    });
  });

  describe('xunit', function() {
    it('prints test cases with --reporter-options output (issue: 1864)', function(done) {
      var randomStr = crypto.randomBytes(8).toString('hex');
      var tmpDir = os.tmpDir().replace(new RegExp(path.sep + '$'), '');
      var tmpFile = tmpDir + path.sep + 'test-issue-1864-' + randomStr + '.xml';

      var args = ['--reporter=xunit', '--reporter-options', 'output=' + tmpFile];
      var expectedOutput = [
        '<testcase classname="suite" name="test1" time="',
        '<testcase classname="suite" name="test2" time="',
        '</testsuite>'
      ];

      run('passing.js', args, function(err, result) {
        if (err) return done(err);

        var xml = fs.readFileSync(tmpFile, 'utf8');
        fs.unlinkSync(tmpFile);

        expectedOutput.forEach(function(line) {
          assert(xml.indexOf(line) !== -1, 'XML did not contain ' + line);
        });

        done(err);
      });
    });
  });
});
