'use strict';

const assert = require('assert');
const {runMochaJSONAsync} = require('./helpers');

describe('parallel run', () => {
  /**
   * @see https://github.com/mochajs/mocha/issues/4559
   */
  it('should allow `import {it} from "mocha"` module syntax', async () => {
    const result = await runMochaJSONAsync('parallel/test3.mjs', [
      '--parallel',
      '--jobs',
      '2',
      require.resolve('./fixtures/parallel/test1.mjs'),
      require.resolve('./fixtures/parallel/test2.mjs')
    ]);
    assert.strictEqual(result.stats.failures, 1);
    assert.strictEqual(result.stats.passes, 2);
  });

  it('should correctly set worker ids for each process', async () => {
    const result = await runMochaJSONAsync('parallel/testworkerid3.mjs', [
      '--parallel',
      '--jobs',
      '2',
      require.resolve('./fixtures/parallel/testworkerid1.mjs'),
      require.resolve('./fixtures/parallel/testworkerid2.mjs')
    ]);
    assert.strictEqual(result.stats.failures, 0);
    assert.strictEqual(result.stats.passes, 3);
  });

  it('should correctly handle circular references in an exception', async () => {
    const result = await runMochaJSONAsync('parallel/circular-error.mjs', [
      '--parallel',
      '--jobs',
      '2',
      require.resolve('./fixtures/parallel/testworkerid1.mjs')
    ]);
    assert.strictEqual(result.stats.failures, 1);
    assert.strictEqual(result.stats.passes, 1);
    assert.strictEqual(result.failures[0].err.message, 'Foo');
    assert.strictEqual(result.failures[0].err.foo.props[0], '[Circular]');
  });

  it('should correctly handle an exception with retries', async () => {
    const result = await runMochaJSONAsync('parallel/circular-error.mjs', [
      '--parallel',
      '--jobs',
      '2',
      '--retries',
      '1',
      require.resolve('./fixtures/parallel/testworkerid1.mjs')
    ]);
    assert.strictEqual(result.stats.failures, 1);
    assert.strictEqual(result.stats.passes, 1);
    assert.strictEqual(result.failures[0].err.message, 'Foo');
    assert.strictEqual(result.failures[0].err.foo.props[0], '[Circular]');
  });
});
