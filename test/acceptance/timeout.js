
describe('timeouts', function(){
  beforeEach(function(done){
    // uncomment
    // setTimeout(done, 3000);
    done();
  })

  it('should error on timeout', function(done){
    // uncomment
    // setTimeout(done, 3000);
    done();
  })

  it('should allow overriding per-test', function(done){
    this.timeout(1000);
    setTimeout(function(){
      done();
    }, 300);
  })

  describe('when disabled', function(){
    var Mocha = require('../../lib/mocha');
    var timeout;

    beforeEach(function(){
      Mocha.Runnable.prototype.disableTimeouts = true;
    })

    afterEach(function(){
      Mocha.Runnable.prototype.disableTimeouts = false;
    })

    it('should be ignored for async suites', function(done){
      this.timeout(5);
      setTimeout(done, 15);
    })

    it('should be ignored for sync suites', function(){
      var start = Date.now();
      this.timeout(5);
      while(Date.now() - start < 15)continue;
    })
  });
})
