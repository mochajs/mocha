'use strict';

var mocha = require('../')
  , Suite = mocha.Suite
  , Runner = mocha.Runner
  , Runnable = mocha.Runnable
  , Test = mocha.Test
  , GlobalObject = require('../lib/global-object');

describe('GlobalObject()', function() {
  var globalObject = GlobalObject();
  var original, dummyFn;

  before(function() {
    globalObject.save();
    original = {
      consoleLog: console.log,
      consoleError: console.error,
      processStdoutWrite: process.stdout.write
    };
    dummyFn = function() {};
  })

  it('should restore global object upon calling .restore()', function() {
    console.log = dummyFn;
    console.error = dummyFn;
    process.stdout.write = dummyFn;

    globalObject.restore();

    console.log.should.not.equal(dummyFn);
    console.log.should.equal(original.consoleLog);

    console.error.should.not.equal(dummyFn);
    console.error.should.equal(original.consoleError);

    process.stdout.write.should.not.equal(dummyFn);
    process.stdout.write.should.equal(original.processStdoutWrite);
  });

  it('should restore global object on sync test completion', function(done){
    var test = new Runnable('foo', function(){
      console.log = dummyFn;
      console.error = dummyFn;
      process.stdout.write = dummyFn;
    });

    test.run(function() {
      console.log.should.not.equal(dummyFn);
      console.log.should.equal(original.consoleLog);

      console.error.should.not.equal(dummyFn);
      console.error.should.equal(original.consoleError);

      process.stdout.write.should.not.equal(dummyFn);
      process.stdout.write.should.equal(original.processStdoutWrite);
      done();
    });
  });

  it('should restore global object on async test completion', function(done){
    var test = new Runnable('foo', function(testDone){
      console.log = dummyFn;
      console.error = dummyFn;
      process.stdout.write = dummyFn;
      process.nextTick(testDone);
    });

    test.run(function() {
      console.log.should.not.equal(dummyFn);
      console.log.should.equal(original.consoleLog);

      console.error.should.not.equal(dummyFn);
      console.error.should.equal(original.consoleError);

      process.stdout.write.should.not.equal(dummyFn);
      process.stdout.write.should.equal(original.processStdoutWrite);
      done();
    });
  });

  it('should restore global object on test failure', function(done){
    var test = new Runnable('foo', function(){
      console.log = dummyFn;
      console.error = dummyFn;
      process.stdout.write = dummyFn;
      throw new Error('Test failed.')
    });

    test.run(function() {
      console.log.should.not.equal(dummyFn);
      console.log.should.equal(original.consoleLog);

      console.error.should.not.equal(dummyFn);
      console.error.should.equal(original.consoleError);

      process.stdout.write.should.not.equal(dummyFn);
      process.stdout.write.should.equal(original.processStdoutWrite);
      done();
    });
  });

});