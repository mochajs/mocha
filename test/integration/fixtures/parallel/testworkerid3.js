import assert from 'assert';

describe('test3', () => {
  it('should run on worker with either id 0 or 1', () => {
    assert.ok(
      process.env.MOCHA_WORKER_ID === '0' || process.env.MOCHA_WORKER_ID === '1'
    );
  });
});
