'use strict';

var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

describe('multiple reporters', function () {
  it('should have 1 test failure', function (done) {
    var mocha = new Mocha({
      reporter: ['spec', 'json']
    });
    var suite = new Suite('Multiple reporters suite', 'root');
    var runner = new Runner(suite);

    /* eslint-disable new-cap */
    var specReporter = new mocha._reporters[0].fn(runner);
    var jsonReporter = new mocha._reporters[1].fn(runner);
    /* eslint-enable new-cap */

    var testTitle = 'json test 1';
    var error = { message: 'an error' };

    suite.addTest(new Test(testTitle, function (done) {
      done(new Error(error.message));
    }));

    runner.run(function () {
      // Verify that each reporter ran
      expect(specReporter).to.have.property('failures');
      expect(specReporter.failures).to.be.an('array');
      expect(specReporter.failures).to.have.length(1);

      expect(jsonReporter).to.have.property('failures');
      expect(jsonReporter.failures).to.be.an('array');
      expect(jsonReporter.failures).to.have.length(1);
      done();
    });
  });

  it('should pass correct reporter options and path to each reporter', function (done) {
    var mocha = new Mocha({
      reporter: [
        'spec',
        'dot',
        'json'
      ],
      reporterOptions: {
        spec: { foo: 'bar' },
        json: { bar: 'baz' }
      }
    });

    var doneCnt = 0;
    function reporterDone () {
      doneCnt++;
      if (doneCnt === 3) {
        done();
      }
    }

    // specReporter
    mocha._reporters[0].fn = function (runner, options) {
      expect(options.reporterOptions).to.have.property('foo', 'bar');
      reporterDone();
    };

    // dot (no options)
    mocha._reporters[1].fn = function (runner, options) {
      expect(options.reporterOptions).to.eql({});
      reporterDone();
    };

    // json
    mocha._reporters[2].fn = function (runner, options) {
      expect(options.reporterOptions).to.have.property('bar', 'baz');
      reporterDone();
    };

    mocha.run();
  });

  it('should pass _default reporter options to each reporter', function (done) {
    var mocha = new Mocha({
      reporter: ['spec', 'json'],
      reporterOptions: {
        _default: { foo: 'bar' }
      }
    });

    var doneCnt = 0;
    function reporterDone () {
      doneCnt++;
      if (doneCnt === 2) {
        done();
      }
    }

    // specReporter
    mocha._reporters[0].fn = function (runner, options) {
      expect(options.reporterOptions).to.have.property('foo', 'bar');
      reporterDone();
    };

    // json
    mocha._reporters[1].fn = function (runner, options) {
      expect(options.reporterOptions).to.have.property('foo', 'bar');
      reporterDone();
    };

    mocha.run();
  });
});
