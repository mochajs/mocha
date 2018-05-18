'use strict';

var helpers = require('./helpers');
var run = helpers.runMocha;
var fs = require('fs');
var path = require('path');

/**
 * Returns an array of diffs corresponding to exceptions thrown from specs,
 * given the plaintext output (-C) of a mocha run.
 *
 * @param  {string}   output
 * returns {string[]}
 */
function getDiffs(output) {
  var diffs, i, inDiff, inStackTrace;

  diffs = [];
  output.split('\n').forEach(function(line) {
    if (line.match(/^\s{2}\d+\)/)) {
      // New spec, e.g. "1) spec title"
      diffs.push([]);
      i = diffs.length - 1;
      inStackTrace = false;
      inDiff = false;
    } else if (!diffs.length || inStackTrace) {
      // Haven't encountered a spec yet
      // or we're in the middle of a stack trace
    } else if (line.indexOf('+ expected - actual') !== -1) {
      inDiff = true;
    } else if (line.match(/at Context/)) {
      // At the start of a stack trace
      inStackTrace = true;
      inDiff = false;
    } else if (inDiff) {
      diffs[i].push(line);
    }
  });

  return diffs.map(function(diff) {
    return diff
      .filter(function(line) {
        return line.trim().length;
      })
      .join('\n');
  });
}

/**
 * Returns content of test/integration/fixtures/diffs/output,
 * post-processed for consumption by tests.
 * @returns {string[]} Array of diff lines
 */
function getExpectedOutput() {
  var output = fs
    .readFileSync(path.join(__dirname, 'fixtures', 'diffs', 'output'), 'UTF8')
    .replace(/\r\n/g, '\n');

  // Diffs are delimited in file by "// DIFF"
  return output
    .split(/\s*\/\/ DIFF/)
    .slice(1)
    .map(function(diff) {
      return diff
        .split('\n')
        .filter(Boolean)
        .join('\n');
    });
}

describe('diffs', function() {
  var diffs, expected;

  before(function(done) {
    run('diffs/diffs.fixture.js', ['-C'], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expected = getExpectedOutput();
      diffs = getDiffs(res.output.replace(/\r\n/g, '\n'));
      done();
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
      expect(diffs[i], 'to be', expected[i]);
    });
  });
});
