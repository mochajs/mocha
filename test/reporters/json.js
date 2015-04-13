var Mocha = require('../../')
  , Suite = Mocha.Suite
  , Runner = Mocha.Runner
  , Test = Mocha.Test;

describe('json reporter', function(){
  var suite, runner;

  beforeEach(function(){
    var mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
    var mochaReporter = new mocha._reporter(runner);
  });

   it('should have 1 test failure', function(done){
     var testTitle = 'json test 1';
     var error = { message: 'oh shit' };

     suite.addTest(new Test(testTitle, function (done) {
       done(new Error(error.message));
     }));

     runner.run(function(failureCount) {
       failureCount.should.be.exactly(1);
       runner.should.have.property('testResults');
       runner.testResults.should.have.property('failures');
       runner.testResults.failures.should.be.an.instanceOf(Array);
       runner.testResults.failures.should.have.a.lengthOf(1);

       var failure = runner.testResults.failures[0];
       failure.should.have.property('title', testTitle);
       failure.err.message.should.equal(error.message);
       failure.should.have.properties('err');

       done();
     });
  });

  it('should have 1 test pending', function(done) {
    var testTitle = 'json test 1';

     suite.addTest(new Test(testTitle));

     runner.run(function(failureCount) {
       failureCount.should.be.exactly(0);
       runner.should.have.property('testResults');
       runner.testResults.should.have.property('pending');
       runner.testResults.pending.should.be.an.instanceOf(Array);
       runner.testResults.pending.should.have.a.lengthOf(1);

       var pending = runner.testResults.pending[0];
       pending.should.have.property('title', testTitle);

       done();
     });
  })

});
