var fs = require('fs');
var os = require('os');
var path = require('path');
var Mocha = require('../../');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;
var should = require('should');

describe('multiple reporters', function() {
  var suite;
  var runner;
  var specReporter;
  var jsonReporter;

  it('should have 1 test failure', function(done) {
    var mocha = new Mocha({
      reporter: ['spec', 'json']
    });
    suite = new Suite('Multiple reporters suite', 'root');
    runner = new Runner(suite);
    specReporter = new mocha._reporters[0].fn(runner);
    jsonReporter = new mocha._reporters[1].fn(runner);

    var testTitle = 'json test 1';
    var error = { message: 'oh shit' };

    suite.addTest(new Test(testTitle, function(done) {
      done(new Error(error.message));
    }));

    runner.run(function() {
      // Verify that each reporter ran
      specReporter.should.have.property('failures');
      specReporter.failures.should.be.an.instanceOf(Array);
      specReporter.failures.should.have.a.lengthOf(1);

      jsonReporter.should.have.property('failures');
      jsonReporter.failures.should.be.an.instanceOf(Array);
      jsonReporter.failures.should.have.a.lengthOf(1);
      done();
    });
  });

  it('should write result to its output path', function(done) {
    var outputFile = path.join(os.tmpDir(), 'mocha-multiple.json');
    var mocha = new Mocha({
      reporter: ['json:' + outputFile]
    });
    var testTitle = 'json output test 1';
    var error = { message: 'oh shit' };

    mocha.suite.addTest(new Test(testTitle, function(done) {
      done(new Error(error.message));
    }));

    mocha.run(function() {
      var content = fs.readFileSync(outputFile, 'UTF-8');
      try {
        JSON.parse(content);
        done();
      } catch (e) {
        done(e);
      } finally {
        fs.unlinkSync(outputFile);
      }
    });
  });

  it('should pass correct reporter options and path to each reporter', function(done) {
    var mocha = new Mocha({
      reporter: [
        'spec',
        'dot:/var/log/dot.txt',
        'json:json.json'
      ],
      reporterOptions: {
        spec: { foo: 'bar' },
        json: { bar: 'baz' }
      }
    });

    // specReporter
    mocha._reporters[0].fn = function(runner, options, path) {
      options.reporterOptions.should.have.property('foo', 'bar');
      should.equal(path, undefined);
    };

    // dot (no options)
    mocha._reporters[1].fn = function(runner, options, path) {
      options.reporterOptions.should.eql({});
      path.should.equal('/var/log/dot.txt');
    };

    // json
    mocha._reporters[2].fn = function(runner, options, path) {
      options.reporterOptions.should.have.property('bar', 'baz');
      path.should.equal('json.json');
      done();
    };

    mocha.run();
  });

  it('should pass _default reporter options to each reporter', function(done) {
    var mocha = new Mocha({
      reporter: ['spec', 'json'],
      reporterOptions: {
        _default: { foo: 'bar' }
      }
    });

    // specReporter
    mocha._reporters[0].fn = function(runner, options) {
      options.reporterOptions.should.have.property('foo', 'bar');
    };

    // json
    mocha._reporters[1].fn = function(runner, options) {
      options.reporterOptions.should.have.property('foo', 'bar');
      done();
    };

    mocha.run();
  });
});
