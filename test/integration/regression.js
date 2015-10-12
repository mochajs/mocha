var assert = require('assert');
var run    = require('./helpers').runMocha;

describe('regressions', function() {
  this.timeout(1000);

  it('issue-1327: should run all 3 specs exactly once', function(done) {
    var args = [];
    run('regression/issue-1327.js', args, function(err, res) {
      var occurences = function(str) {
        var pattern = new RegExp(str, 'g');
        return (res.output.match(pattern) || []).length;
      };

      assert(!err);
      assert.equal(occurences('testbody1'), 1);
      assert.equal(occurences('testbody2'), 1);
      assert.equal(occurences('testbody3'), 1);

      assert.equal(res.code, 1);
      done();
    });
  });

  it('issue-1417: errors should be propagated properly', function () {
    run('regression/issue-1417.js', [], function(err, res) {
      assert(res.output.indexOf('This error should not be masked') > -1, 'Expected error was not displayed');
    });
  });
});
