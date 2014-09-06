var spawn = require('child_process').spawn,
  join = require('path').join;

describe('exit code', function () {
  it('should equal the # of failing tests', function (done) {
    this.timeout(0);
    spawn(join(process.cwd(), 'bin', 'mocha'), [join(__dirname, 'fixture', 'exitcode.spec.js')])
      .on('exit', function(code) {
        code.should.equal(2);
        done();
      });
  });
});
