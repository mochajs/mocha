var assert = require('assert');
var run    = require('./helpers').runMocha;
var args   = [];

describe('.describe()', function() {
  this.timeout(1000);
  it('should throw a helpful error message when a callback for describe is not supplied', function(done) {
    run('suite/describe.callback.js', args, function(err, res) {
      assert(!err);
      pattern = new RegExp('TypeError: a callback is not supplied', 'g');
      var result = res.output.match(pattern) || [];
      assert.equal(result.length, 1);
      done();
    });
  });
});

describe('.xdescribe()', function() {
  this.timeout(1000);
  it('should not throw an error when a callback for xdescribe is not supplied', function(done) {
    run('suite/xdescribe.callback.js', args, function(err, res) {
      assert(!err);
      pattern = new RegExp("Error", 'g');
      var result = res.output.match(pattern) || [];
      assert.equal(result.length, 0);
      done();
    });
  });
});
