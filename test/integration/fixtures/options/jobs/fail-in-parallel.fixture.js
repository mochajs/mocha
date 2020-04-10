'use strict';

it('should fail if in a worker', function() {
  if (/worker\.js$/.test(require.main.filename)) {
    throw new Error('in worker!');
  }
});