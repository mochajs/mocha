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

  it('issue-1794: Can\'t --require custom UI and use it', function(done) {
    var simpleUiPath = path.join(__dirname, 'fixtures', 'regression', '1794', 'simple-ui.js');
    var args = ['--require', simpleUiPath, '--ui', 'simple-ui'];
    run('regression/1794/issue-1794.js', args, function(err, res) {
      assert.equal(res.code, 0, 'Custom UI should be loaded');
      done();
    });
  });

  it('issue-1991: Declarations do not get cleaned up unless you set them to `null` - Memory Leak', function(done) {
    // on a modern MBP takes ±5 seconds on node 4.0, but on older laptops with node 0.12 ±40 seconds.
    // Could easily take longer on even weaker machines (Travis-CI containers for example).
    this.timeout(120000);
    run('regression/issue-1991.js', [], function(err, res) {
      assert.equal(/process out of memory/.test(res.output), false, 'fixture\'s process out of memory!');
      assert.equal(res.code, 0, 'Runnable fn (it/before[Each]/after[Each]) references should be deleted to avoid memory leaks');
      done();
    });
  })
});
