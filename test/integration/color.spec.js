'use strict';

const childProcess = require('node:child_process');
const path = require('node:path');

describe('mocha binary', function () {
  it('should not output colors to pipe', function (done) {
    const command = [path.join('bin', 'mocha'), '--grep', 'missing-test'];
    childProcess.execFile(process.execPath, command, function (err, stdout) {
      if (err) return done(err);

      expect(stdout, 'not to contain', '[90m');

      done();
    });
  });
});
