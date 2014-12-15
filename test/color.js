var assert = require('assert');
var child_process = require('child_process');

describe('Mocha', function() {
  this.timeout(1000);

  it('should not output colors to pipe', function(cb) {
    var command = 'bin/mocha --grep missing-test';
    child_process.exec(command, function(err, stdout, stderr) {
      if (err) return cb(err);

      assert(stdout.indexOf('[90m') === -1);

      cb(null);
    });
  });
});
