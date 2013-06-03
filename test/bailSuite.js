
var mocha = require('../')
  , Suite = mocha.Suite
  , Runner = mocha.Runner
  , Test = mocha.Test;

describe('bailSuite', function(){

  describe('.bailSuite()', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when no argument is passed', function(){
      it('should return the bailSuite value', function(){
        this.suite.bailSuite().should.be.false;
      });
    });

    describe('when argument is passed', function(){
      it('should return the bailSuite object value', function(){
        var newSuite = this.suite.bailSuite(true);
        newSuite.bailSuite().should.be.true;
      });
    });

    describe('when there are several tests in the suite', function(){
      beforeEach(function(){
        forceFailure = function(){throw new Error('force test failure')};

        this.suite.addTest(new Test('a passing test'));
        this.suite.addTest(new Test('a failed test', forceFailure));
        this.suite.addTest(new Test('another failed test', forceFailure));
        this.suite.addTest(new Test('a third failed test', forceFailure));
      });

      it('should fail all three tests', function(){
        var runner = new Runner(this.suite);
        runner.failures.should.equal(0);

        function fn(failures){
          failures.should.equal(3);
        }
        runner.run(fn);

      });

      it('should bail all following tests', function(){
        this.suite.bailSuite(true);
        var runner = new Runner(this.suite);
        runner.failures.should.equal(0);

        function fn(failures){
          failures.should.equal(1);
        }
        runner.run(fn);
      });

      it('should only bail same suite tests', function(){
        var parentSuite = new Suite('Parent Suite');
        var newSuite = new Suite('B Suite');
        newSuite.addTest(new Test('different suite test'), forceFailure);
        parentSuite.addSuite(this.suite);
        parentSuite.addSuite(newSuite);

        this.suite.bailSuite(true);
        var runner = new Runner(parentSuite);

        function fn(failures){
          failures.should.equal(1);
        }

        runner.failures.should.equal(0);
        runner.run(fn);
      });

    });

  });
});