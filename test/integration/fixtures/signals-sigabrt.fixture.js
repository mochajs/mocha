'use strict';

describe('signal suite', function () {
  it('test SIGABRT', function () {
    process.kill(process.pid, 'SIGABRT');
  });
});
