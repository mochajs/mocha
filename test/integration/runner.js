var fsPath = require('path'),
    exec = require('child_process').exec,
    debug = require('debug')('integration test');

var TESTS = __dirname + '/tests/';
var BIN = __dirname + '/../../bin/mocha';

function run(tests, callback) {
  var paths = [];

  var tests = tests.map(function(test) {
    return fsPath.join(TESTS, test);
  });

  var cmd = [BIN, '--reporter', 'json'].concat(tests);
  debug('run', cmd);

  exec(
    cmd.join(' '),
    function(err, stdout, stderr) {
      callback(err, JSON.parse(stdout));
    }
  );
}

module.exports = run;
