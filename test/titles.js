var mocha = require('../')
  , Hook = mocha.Hook
  , Runnable = mocha.Runnable
  , Suite = mocha.Suite
  , Test = mocha.Test;


describe('Hook shortTitle', function(){
  it('should report own title as shortTitle', function(){
    var hook = new Hook('Alpha');
    hook.shortTitle().should.equal('Alpha');
  });
  it('should report own title and test title as shortTitle', function() {
    var hook = new Hook('Beta');
    hook.ctx = { currentTest: new Test('Gamma') };
    hook.shortTitle().should.equal('Beta for "Gamma"');
  })
})

describe('Runnable shortTitle', function(){
  it('should report own title as shortTitle', function() {
    var test = new Runnable('Theta');
    test.shortTitle().should.equal('Theta');
  });
});

describe('Suite shortTitle', function() {
  it('should report own title as shortTitle', function(){
    var suite = new Suite('Phi');
    suite.shortTitle().should.equal('Phi');
  });
});
