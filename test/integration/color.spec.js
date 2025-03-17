'use strict';

var childProcess = require('node:child_process');
var path = require('node:path');

describe('mocha binary', function () {
  it('should not output colors to pipe', function (done) {
    var command = [path.join('bin', 'mocha'), '--grep', 'missing-test'];
    childProcess.execFile(process.execPath, command, function (err, stdout) {
      if (err) return done(err);

      expect(stdout, 'not to contain', '[90m');

      done();
    });
  });
});
