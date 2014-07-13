
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

  describe('when disabled from Mocha.Runnable.prototype.disableTimeouts property', function(){
    var Mocha = require('../../lib/mocha');

    beforeEach(function(){
      Mocha.Runnable.prototype.disableTimeouts = true;
    })

    afterEach(function(){
      Mocha.Runnable.prototype.disableTimeouts = false;
    })

    it('should be ignored for async suites', timeout)
    it('should be ignored for sync suites', syncTimeout)
  })

  describe('when disabled from suite.disableTimeouts()', function(){
    beforeEach(function(){
      this.disableTimeouts(true);
    })

    it('should be ignored for async suites', function(done){
      this.disableTimeouts();
      timeout.call(this, done);
    })

    it('should be ignored for sync suites', function(){
      this.disableTimeouts();
      syncTimeout.call(this);
    })
  })

  function timeout(fn){
    this.timeout(5);
    setTimeout(fn, 15);
  }

  function syncTimeout(){
    var start = Date.now();
    this.timeout(5);
    while(Date.now() - start < timeout) continue;
  }
})
