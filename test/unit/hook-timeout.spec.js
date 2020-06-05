'use strict';

describe('hook timeout', function() {
  before(function(done) {
    setTimeout(done, 100);
  });

  it('should work', function(done) {
    done();
  });
});
