'use strict';

var spawn = require('child_process').spawnSync;
var path = require('path');
var assert = require('assert');

var cmd = 'node ' + path.join(__dirname, '../../bin/mocha');

describe('package.json with correct directories.test', function() {
  var lines;
  before(function() {
    lines = spawn(cmd, [], {
      cwd: path.join(__dirname, './fixtures/package/subdir1'),
      shell: true
    });
  });
  it('should find test file in subdir1-1', function() {
    var line = /test file found: .+/.exec(lines.stdout.toString());
    assert.equal(line, 'test file found: directory subdir1-1');
  });
});

describe('package.json without directories.test', function() {
  var lines;
  before(function() {
    lines = spawn(cmd, [], {
      cwd: path.join(__dirname, './fixtures/package/subdir2'),
      shell: true
    });
  });
  it('should find test file in default test', function() {
    var line = /test file found: .+/.exec(lines.stdout.toString());
    assert.equal(line, 'test file found: default directory test');
  });
});

describe('package.json with fake directories.test', function() {
  var lines;
  before(function() {
    lines = spawn(cmd, [], {
      cwd: path.join(__dirname, './fixtures/package/subdir3'),
      shell: true
    });
  });
  it('should not find any test file', function() {
    var line = /Warning: Could not find .+/.exec(lines.stderr.toString());
    assert.equal(
      line,
      'Warning: Could not find any test files matching pattern: fake-directory'
    );
  });
});
