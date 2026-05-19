'use strict';

const assert = require('node:assert');

describe('retries with wait as ms shorthand', function () {
  this.retries(1, { wait: '120ms' });

  let attempts = 0;
  let prev = 0;

  it('waits between attempts (string form)', function () {
    const now = Date.now();
    attempts++;
    if (attempts === 1) {
      prev = now;
      throw new Error('force a retry');
    }
    const gap = now - prev;
    assert.ok(gap >= 100, 'expected wait >= 100ms, got ' + gap + 'ms');
  });
});
