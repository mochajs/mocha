'use strict';

describe('suite-level override', function() {
  this.timeout(10);

  it('should not time out an async test', function(done) {
    setTimeout(done, 2);
  });

  it('should not time out a sync test', function() {
    var start = Date.now();
    while (Date.now() - start < 60);
  });
});

describe('test-level override', function() {
  it('should not time out', function(done) {
    this.timeout(10);
    setTimeout(done, 60);
  });
});

describe('hook-level override', function() {
  before(function(done) {
    this.timeout(10);
    setTimeout(done, 60);
  });

  it('should run once the hook is done', function() {});
});
