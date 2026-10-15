import assert from 'assert';

describe('test1', () => {
  it('should always run on worker with id 0', () => {
    assert.ok(process.env.MOCHA_WORKER_ID === '0');
  });
});
