var assert = require('assert');
var run    = require('./helpers').runMocha;

describe('reporters', function() {
  this.timeout(1000);

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
});
