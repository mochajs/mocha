var spawn = require('child_process').spawn;

describe('dry-run', function(done){
  it('should pass each test without running any tests', function(done){
    var run = spawn('./bin/mocha', [__filename, '--dry-run', '--reporter', 'json']);
    var stdout = '';
    var stderr = '';

    run.stdout.on('data', function (data) {
      stdout += data.toString();
    });

    run.stderr.on('data', function (data) {
      stderr += data.toString();
    });

    run.on('close', function (code) {
      stderr.should.be.empty;
      var tests = [{
          "title": "should pass each test without running any tests",
          "fullTitle": "dry-run should pass each test without running any tests"
      }];
      var json = JSON.parse(stdout.trim());
      json.tests.should.eql(tests);
      json.passes.should.eql(tests);
      done();
    });
  })
})
