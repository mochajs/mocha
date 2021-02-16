'use strict';

const assert = require('assert');
const {runMochaJSONAsync} = require('./helpers');
const semver = require('semver');

describe('parallel run', () => {
  /**
   * @see https://github.com/mochajs/mocha/issues/4559
   */
  it('should allow `import {it} from "mocha"` module syntax', async () => {
    if (semver.major(process.version) <= 10) {
      console.log(
        `[SKIPPED] for node ${process.version} (es module syntax isn't supported on node <= 10)`
      );
    } else {
      const result = await runMochaJSONAsync('parallel/test3.mjs', [
        '--parallel',
        '--jobs',
        '2',
        require.resolve('./fixtures/parallel/test1.mjs'),
        require.resolve('./fixtures/parallel/test2.mjs')
      ]);
      assert.strictEqual(result.stats.failures, 1);
      assert.strictEqual(result.stats.passes, 2);
    }
  });
});
