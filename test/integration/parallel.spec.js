'use strict';

const assert = require('node:assert');
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

  it('should correctly handle circular array references in an exception', async () => {
    const result = await runMochaJSONAsync('parallel/circular-error-array.mjs', [
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
    const result = await runMochaJSONAsync('parallel/circular-error-array.mjs', [
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

  it('should correctly handle circular object references in an exception', async () => {
    const result = await runMochaJSONAsync('parallel/circular-error-object.mjs', [
      '--parallel',
      '--jobs',
      '2',
      require.resolve('./fixtures/parallel/testworkerid1.mjs')
    ]);
    assert.strictEqual(result.stats.failures, 1);
    assert.strictEqual(result.stats.passes, 1);
    assert.strictEqual(result.failures[0].err.message, 'Oh no!');
    assert.deepStrictEqual(result.failures[0].err.values, [ { toB: { toA: '[Circular]' } } ]);
  });

  it('should correctly handle a non-writable getter reference in an exception', async () => {
    const result = await runMochaJSONAsync('parallel/getter-error-object.mjs', [
      '--parallel',
      '--jobs',
      '2',
      require.resolve('./fixtures/parallel/testworkerid1.mjs')
    ]);
    assert.strictEqual(result.stats.failures, 1);
    assert.strictEqual(result.stats.passes, 1);
    assert.strictEqual(result.failures[0].err.message, 'Oh no!');
  });
});
