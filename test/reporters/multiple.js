
var Mocha = require('../../')
  , Suite = Mocha.Suite
  , Runner = Mocha.Runner
  , Test = Mocha.Test;

describe('multiple reporters', function(){
  var suite, runner, specReporter, jsonReporter;

  beforeEach(function(){
    var mocha = new Mocha({
      reporter: ['spec', 'json']
    });
    suite = new Suite('Multiple reporters suite', 'root');
    runner = new Runner(suite);
    specReporter = new mocha._reporters[0](runner);
    jsonReporter = new mocha._reporters[1](runner);
  })

  it('should have 1 test failure', function(done){
    var testTitle = 'json test 1';
    var error = { message: 'oh shit' };

    suite.addTest(new Test(testTitle, function (done) {
      done(new Error(error.message));
    }));

    runner.run(function(failureCount) {

      // Verify that each reporter ran
      specReporter.should.have.property('failures');
      specReporter.failures.should.be.an.instanceOf(Array);
      specReporter.failures.should.have.a.lengthOf(1);

      jsonReporter.should.have.property('failures');
      jsonReporter.failures.should.be.an.instanceOf(Array);
      jsonReporter.failures.should.have.a.lengthOf(1);
      done();
    });
  })

})
