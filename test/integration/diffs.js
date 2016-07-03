var assert   = require('assert');
var helpers  = require('./helpers');
var run      = helpers.runMocha;
var fs       = require('fs');
var getDiffs = helpers.getDiffs;

function getExpectedOutput() {
  var output = fs.readFileSync('test/integration/fixtures/diffs/output', 'UTF8');

  // Diffs are delimited in file by "// DIFF"
  return output.split(/\s*\/\/ DIFF/).slice(1).map(function(diff) {
    return diff.split('\n').filter(Boolean).join('\n');
  });
}

describe('diffs', function() {
  var diffs, expected;

  before(function(done) {
    run('diffs/diffs.js', ['-C'], function(err, res) {
      expected = getExpectedOutput();
      diffs = getDiffs(res.output);
      done(err);
    });
  });

  [
    'should display a diff for small strings',
    'should display a diff of canonicalized objects',
    'should display a diff for medium strings',
    'should display a diff for entire object dumps',
    'should display a diff for multi-line strings',
    'should display a diff for entire object dumps',
    'should display a full-comparison with escaped special characters',
    'should display a word diff for large strings',
    'should work with objects',
    'should show value diffs and not be affected by commas',
    'should display diff by data and not like an objects'
  ].forEach(function(title, i) {
    it(title, function() {
      assert.equal(diffs[i], expected[i]);
    });
  });
});
