'use strict';
const os = require('node:os');

describe('signal suite', function () {
  it('test SIGTERM', function () {
    process.kill(process.pid, os.constants.signals['SIGTERM']);
  });
});
