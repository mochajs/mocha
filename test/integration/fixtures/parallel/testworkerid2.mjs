import assert from 'assert';

describe('test2', () => {
  it('should always run on worker with id 1', () => {
    assert.ok(process.env.MOCHA_WORKER_ID === '1');
  });
});
