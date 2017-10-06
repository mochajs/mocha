'use strict';

var assert = require('assert');
var childProcess = require('child_process');
var path = require('path');

describe('Mocha', function () {
  this.timeout(4000);

  it('should not output colors to pipe', function (cb) {
    var command = [path.join('bin', 'mocha'), '--grep', 'missing-test'];
    childProcess.execFile(process.execPath, command, function (err, stdout, stderr) {
      if (err) return cb(err);

      assert(stdout.indexOf('[90m') === -1);

      cb(null);
    });
  });
});
