'use strict';

describe('signal suite', function () {
  it('test SIGTERM', function () {
    process.kill(process.pid, 'SIGTERM');
  });
});
