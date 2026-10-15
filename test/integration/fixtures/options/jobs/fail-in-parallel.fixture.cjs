'use strict';

it('should fail if in a worker', function() {
  if (!require('workerpool').isMainThread) {
    throw new Error('in worker!');
  }
});
