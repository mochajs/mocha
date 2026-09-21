'use strict';

describe('suite-level override', function() {
  this.timeout(1);

  it('should not time out an async test', function(done) {
    setTimeout(done, 2);
  });

  it('should not time out a sync test', function() {
    var start = Date.now();
    while (Date.now() - start < 2);
  });
});

describe('test-level override', function() {
  it('should not time out', function(done) {
    this.timeout(1);
    setTimeout(done, 2);
  });
});

describe('hook-level override', function() {
  before(function(done) {
    this.timeout(1);
    setTimeout(done, 2);
  });

  it('should run once the hook is done', function() {});
});
