'use strict';

describe('a suite', function() {
  it('should succeed in 500ms', function(done) {
    setTimeout(done, 500);
  });

  it('should succeed in 1.1s', function(done) {
    setTimeout(done, 1100);
  });
});
