'use strict';

describe('timeouts', function() {
  beforeEach(function(done) {
    // uncomment
    // setTimeout(done, 3000);
    done();
  });

  it('should error on timeout', function(done) {
    // uncomment
    // setTimeout(done, 3000);
    done();
  });

  it('should allow overriding per-test', function(done) {
    this.timeout(200);
    setTimeout(function() {
      done();
    }, 50);
  });

  describe('disabling', function() {
    it('should allow overriding per-test', function(done) {
      this.enableTimeouts(false);
      this.timeout(1);
      setTimeout(done, 2);
    });

    it('should work with timeout(0)', function(done) {
      this.timeout(0);
      setTimeout(done, 1);
    });

    describe('using beforeEach', function() {
      beforeEach(function() {
        this.timeout(0);
      });

      it('should work with timeout(0)', function(done) {
        setTimeout(done, 1);
      });
    });

    describe('using before', function() {
      before(function() {
        this.timeout(0);
      });

      it('should work with timeout(0)', function(done) {
        setTimeout(done, 1);
      });
    });

    describe('using enableTimeouts(false)', function() {
      this.timeout(4);

      it('should suppress timeout(4)', function(done) {
        this.slow(100);
        // The test is in the before() call.
        this.enableTimeouts(false);
        setTimeout(done, 50);
      });
    });

    describe('suite-level', function() {
      this.timeout(0);

      it('should work with timeout(0)', function(done) {
        setTimeout(done, 1);
      });

      describe('nested suite', function() {
        it('should work with timeout(0)', function(done) {
          setTimeout(done, 1);
        });
      });
    });
  });
});
