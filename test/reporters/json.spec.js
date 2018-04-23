'use strict';

var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

describe('json reporter', function() {
  var suite, runner;
  var testTitle = 'json test 1';

  beforeEach(function() {
    var mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
    /* eslint no-unused-vars: off */
    var mochaReporter = new mocha._reporter(runner);
  });

  it('should have 1 test failure', function(done) {
    var error = {message: 'oh shit'};

    suite.addTest(
      new Test(testTitle, function(done) {
        done(new Error(error.message));
      })
    );

    runner.run(function(failureCount) {
      expect(failureCount).to.be(1);
      expect(runner).to.have.property('testResults');
      expect(runner.testResults).to.have.property('failures');
      expect(runner.testResults.failures).to.be.an('array');
      expect(runner.testResults.failures).to.have.length(1);

      var failure = runner.testResults.failures[0];
      expect(failure).to.have.property('title', testTitle);
      expect(failure.err.message).to.equal(error.message);
      expect(failure).to.have.property('err');

      done();
    });
  });

  it('should have 1 test pending', function(done) {
    suite.addTest(new Test(testTitle));

    runner.run(function(failureCount) {
      expect(failureCount).to.be(0);
      expect(runner).to.have.property('testResults');
      expect(runner.testResults).to.have.property('pending');
      expect(runner.testResults.pending).to.be.an('array');
      expect(runner.testResults.pending).to.have.length(1);

      var pending = runner.testResults.pending[0];
      expect(pending).to.have.property('title', testTitle);

      done();
    });
  });

  it('should handle circular objects in errors', function(done) {
    var testTitle = 'json test 1';
    function CircleError() {
      this.message = 'oh shit';
      this.circular = this;
    }
    var error = new CircleError();

    suite.addTest(
      new Test(testTitle, function(done) {
        throw error;
      })
    );

    runner.run(function(failureCount) {
      expect(failureCount).to.equal(1);
      expect(runner).to.have.property('testResults');
      expect(runner.testResults).to.have.property('failures');
      expect(runner.testResults.failures).to.be.an(Array);
      expect(runner.testResults.failures).to.have.length(1);

      var failure = runner.testResults.failures[0];
      expect(failure).to.have.property('title', testTitle);
      expect(failure).to.have.property('err');

      done();
    });
  });
});
