
var Mocha = require('../../')
  , Suite = Mocha.Suite
  , Runner = Mocha.Runner
  , Test = Mocha.Test;

describe('Runner', function(){
  var suite, runner;

  beforeEach(function(){
    var mocha = new Mocha({
      reporter: 'json'
    });
    suite = new Suite('JSON suite', 'root');
    runner = new Runner(suite);
    var mochaReporter = new mocha._reporter(runner);
  })

   it('should have 1 test failure', function(done){
     var testTitle = 'json test 1';
     suite.addTest(new Test(testTitle, function (done) {
       done(testTitle);
     }));

     runner.run(function(failureCount) {
       failureCount.should.be.exactly(1);
       runner.should.have.property('testResults');
       runner.testResults.should.have.property('failures');
       runner.testResults.failures.should.be.an.instanceOf(Array);
       runner.testResults.failures.should.have.a.lengthOf(1);
       var failure = runner.testResults.failures[0];
       failure.should.have.property('title', testTitle);
       failure.should.have.properties('err', 'errStack', 'errMessage');
       failure.errMessage.should.endWith(testTitle);

       done();
     });
  })

})
