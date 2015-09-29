var assert = require('assert');
var fs     = require('fs');
var path   = require('path');
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

  it('should not duplicate mocha.opts args in process.argv', function() {
    var processArgv = process.argv.join('');
    var mochaOpts = fs.readFileSync(path.join(__dirname, '..', 'mocha.opts'), 'utf-8').split(/[\s]+/).join('');
    assert.notEqual(processArgv.indexOf(mochaOpts), -1, 'process.argv missing mocha.opts');
    assert.equal(processArgv.indexOf(mochaOpts), processArgv.lastIndexOf(mochaOpts), 'process.argv contains duplicated mocha.opts');
  });
});
