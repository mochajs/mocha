
var mocha = require('../')
  , Runnable = mocha.Runnable;

describe('Runnable', function(){
  describe('#timeout(ms)', function(){
    it('should set the timeout', function(){
      var run = new Runnable;
      run.timeout(1000)
      run.timeout().should.equal(1000);
    })
  })
})