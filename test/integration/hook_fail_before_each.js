#! /usr/bin/env node

var run = require('./runner');
var expected = require('./tests/hook_fail_before_each.json');
var assert = require('assert');

run([
  'hook_fail_before_each/one.js',
  'hook_fail_before_each/two.js',
  'hook_fail_before_each/three.js'
], function(err, report) {
  if (!err) {
    console.error('mocha should fail');
    process.exit(1);
  }
  assert.deepEqual(report.tests, expected.tests);
});
