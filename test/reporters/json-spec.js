var child = require('child_process');

describe('json-spec reporter', function () {
  this.timeout(5000);

  var mocha, stdout, stderr;

  beforeEach(function (done) {
    var cmd = 'node',
      args = [__dirname + '/../../bin/mocha', '-R', 'json-spec', __dirname + '/simplepass.js'],
      options = {};

    stdout = '';
    stderr = '';
    mocha = child.spawn(cmd, args, options);

    done();
  });

  it('should produce stdout that is JSON.parseable', function (done) {

    mocha.stdout.on('data', function (data) {
      stdout += data;
    });

    mocha.stderr.on('data', function (data) {
      stderr += data;
    });

    mocha.on('close', function (code) {
      (JSON.parse(stdout)).should.be.ok;
      done();
    });

  });

  it('should produce stderr that is the spec output', function (done) {

    mocha.stdout.on('data', function (data) {
      stdout += data;
    });

    mocha.stderr.on('data', function (data) {
      stderr += data;
    });

    mocha.on('close', function (code) {
      (/feeder/.test(stderr)).should.be.true;
      done();
    });

  });

});
