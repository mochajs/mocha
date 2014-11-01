var mocha = require('../../')
  , Suite = mocha.Suite
  , Runner = mocha.Runner
  , Test = mocha.Test;

describe('a test that throws', function () {
  var suite, runner;

  beforeEach(function(){
    suite = new Suite(null, 'root');
    runner = new Runner(suite);
  })

  this.timeout(50);

  describe('undefined', function (){
    it('should not pass if throwing sync and test is sync', function(done) {
      var test = new Test('im sync and throw undefined sync', function(){
        throw undefined;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function(){
        runner.failures.should.equal(1);
        test.state.should.equal('failed');
        done();
      });
      runner.run();
    })

    it('should not pass if throwing sync and test is async', function(done){
      var test = new Test('im async and throw undefined sync', function(done2){
        throw undefined;
        process.nexTick(done2);
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function(){
        runner.failures.should.equal(1);
        test.state.should.equal('failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function(done){
      var test = new Test('im async and throw undefined async', function(done2){
        process.nexTick(function(){
          throw undefined;
          done2();
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function(){
        runner.failures.should.equal(1);
        test.state.should.equal('failed');
        done();
      });
      runner.run();
    })
  })

  describe('null', function (){
    it('should not pass if throwing sync and test is sync', function(done) {
      var test = new Test('im sync and throw null sync', function(){
        throw null;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function(){
        runner.failures.should.equal(1);
        test.state.should.equal('failed');
        done();
      });
      runner.run();
    })

    it('should not pass if throwing sync and test is async', function(done){
      var test = new Test('im async and throw null sync', function(done2){
        throw null;
        process.nexTick(done2);
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function(){
        runner.failures.should.equal(1);
        test.state.should.equal('failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function(done){
      var test = new Test('im async and throw null async', function(done2){
        process.nexTick(function(){
          throw null;
          done2();
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function(){
        runner.failures.should.equal(1);
        test.state.should.equal('failed');
        done();
      });
      runner.run();
    })
  })
})