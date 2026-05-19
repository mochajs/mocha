'use strict';

const assert = require('node:assert');

describe('retries with wait', function () {
  this.retries(2, { wait: 100 });

  const timestamps = [];

  it('waits between attempts', function () {
    timestamps.push(Date.now());
    if (timestamps.length < 3) {
      throw new Error('retry attempt ' + timestamps.length);
    }
    for (let i = 1; i < timestamps.length; i++) {
      const gap = timestamps[i] - timestamps[i - 1];
      assert.ok(
        gap >= 90,
        'expected gap between attempts to be >= 90ms, got ' + gap + 'ms',
      );
    }
  });
});
