'use strict'

const { spawnSync } = require('child_process');
const { resolve} = require('path');
const { expect } = require('chai');

describe('global teardown errors', () => {
  it('should fail with non-zero exit code and report the teardown error', () => {

    const testFile = resolve(__dirname, './fixtures/global-teardown-error.js');

    const result = spawnSync(process.execPath, [
      './bin/mocha',
      testFile,
      '--reporter', 'spec'
    ], { encoding: 'utf-8' });

    expect(result.status).to.equal(1);
    expect(result.stderr).to.include('Global fixture error');
    expect(result.stderr).to.include('Error: Teardown problem');
  });
});