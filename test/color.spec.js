var assert = require('assert');
var child_process = require('child_process');
var path = require('path');

describe('Mocha', function() {
  this.timeout(2000);

  it('should not output colors to pipe', function(cb) {
    var command = [path.join('bin', 'mocha'), '--grep', 'missing-test'];
    child_process.execFile(process.execPath, command, function(err, stdout, stderr) {
      if (err) return cb(err);

      assert(stdout.indexOf('[90m') === -1);

      cb(null);
    });
  });
});
