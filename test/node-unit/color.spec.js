'use strict';

var childProcess = require('child_process');
var path = require('path');

describe('Mocha', function() {
  this.timeout(4000);

  it('should not output colors to pipe', function(cb) {
    var command = [path.join('bin', 'mocha'), '--grep', 'missing-test'];
    childProcess.execFile(process.execPath, command, function(
      err,
      stdout,
      stderr
    ) {
      if (err) return cb(err);

      expect(stdout, 'not to contain', '[90m');

      cb(null);
    });
  });
});
