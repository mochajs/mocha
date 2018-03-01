'use strict';

it('should bail if a successful test asynchronously fails', function(done) {
  done();
  process.nextTick(function () {
    throw new Error('global error');
  });
});

it('should not actually get run', function () {
});
